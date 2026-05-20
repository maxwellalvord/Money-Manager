"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses, RecurringExpenses, UserSettings } from '@/utils/schema'
import { and, eq, inArray } from 'drizzle-orm'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  const email = primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
  if (!email) throw new Error('No email address found for user')
  return email
}

export async function getRecurringByBudget(budgetId) {
  const email = await getEmail()
  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(and(eq(Budgets.id, Number(budgetId)), eq(Budgets.createdBy, email)))
  if (!owned.length) throw new Error('Unauthorized')

  return db.select()
    .from(RecurringExpenses)
    .where(and(eq(RecurringExpenses.budgetId, Number(budgetId)), eq(RecurringExpenses.createdBy, email)))
}

export async function addRecurring({ name, amount, budgetId, dueDay }) {
  const email = await getEmail()
  const n = Number(amount)
  if (!name?.trim() || !Number.isFinite(n) || n <= 0) throw new Error('Invalid input')
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 28) throw new Error('Due day must be 1–28')

  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(and(eq(Budgets.id, Number(budgetId)), eq(Budgets.createdBy, email)))
  if (!owned.length) throw new Error('Unauthorized')

  return db.insert(RecurringExpenses)
    .values({ name: name.trim(), amount: String(n), budgetId: Number(budgetId), createdBy: email, dueDay })
    .returning()
}

export async function deleteRecurring(id) {
  const email = await getEmail()
  const owned = await db.select({ id: RecurringExpenses.id })
    .from(RecurringExpenses)
    .where(and(eq(RecurringExpenses.id, Number(id)), eq(RecurringExpenses.createdBy, email)))
  if (!owned.length) throw new Error('Unauthorized')

  return db.delete(RecurringExpenses).where(eq(RecurringExpenses.id, Number(id)))
}

export async function deleteRecurringByBudgets(budgetIds) {
  if (!budgetIds.length) return
  return db.delete(RecurringExpenses).where(inArray(RecurringExpenses.budgetId, budgetIds))
}

// Applies any recurring expenses that are due in the current budget period.
// Safe to call on every page load — skips entries already applied this period.
export async function applyDueRecurring() {
  const email = await getEmail()

  const [settings] = await db.select()
    .from(UserSettings)
    .where(eq(UserSettings.email, email))
  if (!settings) return

  const periodStart = settings.budgetPeriodStart ? new Date(settings.budgetPeriodStart) : null
  const today = new Date()
  const todayDay = today.getDate()

  const recurring = await db.select()
    .from(RecurringExpenses)
    .where(eq(RecurringExpenses.createdBy, email))

  const toApply = recurring.filter(r => {
    if (r.dueDay > todayDay) return false
    if (!periodStart) return true
    const lastApplied = r.lastAppliedAt ? new Date(r.lastAppliedAt) : null
    return !lastApplied || lastApplied < periodStart
  })

  if (!toApply.length) return

  const now = today.toISOString()
  await Promise.all(toApply.map(r =>
    db.insert(Expenses).values({
      name: r.name,
      amount: String(r.amount),
      budgetId: r.budgetId,
      createdBy: email,
      createdAt: now,
      isOverride: 0,
    })
  ))

  await Promise.all(toApply.map(r =>
    db.update(RecurringExpenses)
      .set({ lastAppliedAt: now })
      .where(eq(RecurringExpenses.id, r.id))
  ))
}

// Called from triggerMonthEnd (continue path) — resets lastAppliedAt so
// recurring expenses are re-evaluated against the new period start.
export async function resetRecurringForNewPeriod(email) {
  await db.update(RecurringExpenses)
    .set({ lastAppliedAt: null })
    .where(eq(RecurringExpenses.createdBy, email))
}
