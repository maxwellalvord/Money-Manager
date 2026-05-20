"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses, MonthlyStatements, UserSettings } from '@/utils/schema'
import { and, eq, getTableColumns, inArray, isNull, or, sql } from 'drizzle-orm'
import { getSettings } from './settings'
import { resetRecurringForNewPeriod, applyDueRecurring } from './recurring'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  const email = primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
  if (!email) throw new Error('No email address found for user')
  return email
}

function validateAmount(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) throw new Error('Amount must be a positive number')
  return n
}

export async function getOrCreateSavingsBudget() {
  const email = await getEmail()

  // Prefer the designated default savings budget
  const existing = await db.select()
    .from(Budgets)
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.isDefaultSavings, 1)))
    .limit(1)
  if (existing.length > 0) return existing[0]

  // Migrate: if any savings budget exists without the flag, promote the first one
  const anySavings = await db.select()
    .from(Budgets)
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.isSavings, 1)))
    .limit(1)
  if (anySavings.length > 0) {
    await db.update(Budgets).set({ isDefaultSavings: 1 }).where(eq(Budgets.id, anySavings[0].id))
    return { ...anySavings[0], isDefaultSavings: 1 }
  }

  const [created] = await db.insert(Budgets)
    .values({ name: 'Savings', amount: '0', icon: '💰', createdBy: email, isSavings: 1, isDefaultSavings: 1 })
    .returning()
  return created
}

export async function createSavingsBudget({ name, icon = '🏦', savingsGoal }) {
  const email = await getEmail()
  if (!name?.trim()) throw new Error('Name is required')
  const [created] = await db.insert(Budgets)
    .values({
      name: name.trim(),
      amount: '0',
      icon,
      createdBy: email,
      isSavings: 1,
      isDefaultSavings: 0,
      savingsGoal: savingsGoal ? String(savingsGoal) : null,
    })
    .returning()
  return created
}

export async function getNonSavingsBudgets() {
  const email = await getEmail()
  return db.select()
    .from(Budgets)
    .where(and(
      eq(Budgets.createdBy, email),
      or(isNull(Budgets.isSavings), eq(Budgets.isSavings, 0))
    ))
}

export async function triggerMonthEnd() {
  const email = await getEmail()

  const [settings, budgets] = await Promise.all([
    getSettings(),
    db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`coalesce(sum(case when ${Expenses.isOverride} != 2 then ${Expenses.amount} else 0 end), 0)`.mapWith(Number),
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, email))
      .groupBy(Budgets.id),
  ])

  const monthlyBudget = Number(settings[0]?.monthlyBudget ?? 0)
  const totalSpent = budgets
    .filter(b => !b.isSavings)
    .reduce((sum, b) => sum + (b.totalSpend || 0), 0)
  const totalLeftover = Math.max(0, monthlyBudget - totalSpent)

  let savings = budgets.find(b => b.isSavings)

  const now = new Date()
  const periodLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' })
  const regularBudgets = budgets.filter(b => !b.isSavings)
  const regularBudgetIds = regularBudgets.map(b => b.id)

  // Query override aggregates and individual expenses per budget BEFORE clearing
  let overrideMap = {}
  let expensesByBudget = {}
  if (regularBudgetIds.length > 0) {
    const [overrideRows, expenseRows] = await Promise.all([
      db.select({
        budgetId: Expenses.budgetId,
        overrideCount: sql`count(*)`.mapWith(Number),
        overrideAmount: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
      }).from(Expenses)
        .where(and(inArray(Expenses.budgetId, regularBudgetIds), eq(Expenses.isOverride, 1)))
        .groupBy(Expenses.budgetId),
      db.select({
        budgetId: Expenses.budgetId,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        isOverride: Expenses.isOverride,
      }).from(Expenses)
        .where(inArray(Expenses.budgetId, regularBudgetIds)),
    ])
    overrideMap = Object.fromEntries(overrideRows.map(r => [r.budgetId, r]))
    for (const exp of expenseRows) {
      if (!expensesByBudget[exp.budgetId]) expensesByBudget[exp.budgetId] = []
      expensesByBudget[exp.budgetId].push({
        name: exp.name,
        amount: Number(exp.amount),
        createdAt: exp.createdAt,
        isOverride: exp.isOverride ?? 0,
      })
    }
  }

  const budgetBreakdown = regularBudgets.map(b => ({
    name: b.name,
    icon: b.icon,
    amount: Number(b.amount),
    totalSpend: Number(b.totalSpend) || 0,
    budgetOverride: b.isOverride === 1,
    overrideCount: overrideMap[b.id]?.overrideCount || 0,
    overrideAmount: overrideMap[b.id]?.overrideAmount || 0,
    expenses: expensesByBudget[b.id] || [],
  }))

  // Use designated default savings, falling back to any savings budget
  let defaultSavings = budgets.find(b => b.isDefaultSavings === 1) || budgets.find(b => b.isSavings)
  if (defaultSavings && !defaultSavings.isDefaultSavings) {
    await db.update(Budgets).set({ isDefaultSavings: 1 }).where(eq(Budgets.id, defaultSavings.id))
  }
  savings = defaultSavings

  // Create or update savings budget
  if (!savings) {
    const [created] = await db.insert(Budgets)
      .values({ name: 'Savings', amount: String(totalLeftover), icon: '💰', createdBy: email, isSavings: 1, isDefaultSavings: 1 })
      .returning()
    savings = created
  } else if (totalLeftover > 0) {
    const newAmount = Number(savings.amount) + totalLeftover
    await db.update(Budgets)
      .set({ amount: String(newAmount) })
      .where(eq(Budgets.id, savings.id))
  }

  // Snapshot the statement
  await db.insert(MonthlyStatements).values({
    email,
    periodLabel,
    periodEnd: now.toISOString(),
    monthlyBudget: String(monthlyBudget),
    totalSpent: String(totalSpent),
    savedAmount: String(totalLeftover),
    budgetBreakdown: JSON.stringify(budgetBreakdown),
  })

  // Clear expenses from regular budgets
  if (regularBudgetIds.length > 0) {
    await db.delete(Expenses).where(inArray(Expenses.budgetId, regularBudgetIds))
  }

  // Reset budget period start
  await db.update(UserSettings)
    .set({ budgetPeriodStart: now.toISOString() })
    .where(eq(UserSettings.email, email))

  // Reset recurring lastAppliedAt so they re-fire in the new period, then apply any due today
  await resetRecurringForNewPeriod(email)
  await applyDueRecurring()

  return { savedAmount: totalLeftover, savingsBudgetId: savings.id }
}

export async function transferFromSavings({ savingsBudgetId, targetBudgetId, amount, targetBudgetName }) {
  const email = await getEmail()
  const transferAmount = validateAmount(amount)

  // Fetch savings with current spend to verify sufficient balance
  const [savings] = await db.select({
    ...getTableColumns(Budgets),
    totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.id, Number(savingsBudgetId)), eq(Budgets.createdBy, email)))
    .groupBy(Budgets.id)

  if (!savings) throw new Error('Unauthorized')

  const savingsRemaining = Number(savings.amount) - savings.totalSpend
  if (transferAmount > savingsRemaining) throw new Error('Transfer amount exceeds available savings')

  const [target] = await db.select()
    .from(Budgets)
    .where(and(eq(Budgets.id, Number(targetBudgetId)), eq(Budgets.createdBy, email)))
  if (!target) throw new Error('Target budget not found')

  const now = new Date().toISOString()

  await db.insert(Expenses).values({
    name: `Transfer → ${targetBudgetName}`,
    amount: String(transferAmount),
    budgetId: Number(savingsBudgetId),
    createdBy: email,
    createdAt: now,
  })

  await db.update(Budgets)
    .set({ amount: String(Number(target.amount) + transferAmount) })
    .where(eq(Budgets.id, Number(targetBudgetId)))

  await db.insert(Expenses).values({
    name: `💰 From Savings`,
    amount: String(transferAmount),
    budgetId: Number(targetBudgetId),
    createdBy: email,
    createdAt: now,
    isOverride: 2,
  })
}
