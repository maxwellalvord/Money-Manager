"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { and, desc, eq, getTableColumns, inArray, isNull, or, sql } from 'drizzle-orm'

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

function validateName(name) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) throw new Error('Name is required')
  if (name.trim().length > 100) throw new Error('Name must be 100 characters or fewer')
}

export async function getBudgetsWithSpend() {
  const email = await getEmail()
  return db.select({
    ...getTableColumns(Budgets),
    totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
    totalItem: sql`count(${Expenses.id})`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id))
}

export async function getBudgetById(id) {
  const email = await getEmail()
  const result = await db.select({
    ...getTableColumns(Budgets),
    totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
    totalItem: sql`count(${Expenses.id})`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(and(eq(Budgets.createdBy, email), eq(Budgets.id, Number(id))))
    .groupBy(Budgets.id)
  return result[0] ?? null
}

export async function createBudget({ name, amount, icon, dueDate, isOverride = 0 }) {
  const email = await getEmail()
  validateName(name)
  validateAmount(amount)
  return db.insert(Budgets)
    .values({ name: name.trim(), amount, createdBy: email, icon, dueDate: dueDate || null, isOverride })
    .returning({ insertedId: Budgets.id })
}

export async function updateBudget(id, { name, amount, icon, dueDate }) {
  const email = await getEmail()
  validateName(name)
  validateAmount(amount)
  return db.update(Budgets)
    .set({ name: name.trim(), amount: Number(amount), icon, dueDate: dueDate || null })
    .where(and(eq(Budgets.id, Number(id)), eq(Budgets.createdBy, email)))
    .returning()
}

export async function deleteAllNonSavingsBudgets() {
  const email = await getEmail()
  const toDelete = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(and(
      eq(Budgets.createdBy, email),
      or(isNull(Budgets.isSavings), eq(Budgets.isSavings, 0))
    ))

  if (toDelete.length === 0) return

  const ids = toDelete.map(b => b.id)
  await db.delete(Expenses).where(inArray(Expenses.budgetId, ids))
  await db.delete(Budgets).where(inArray(Budgets.id, ids))
}

export async function deleteBudgetWithExpenses(id) {
  const email = await getEmail()
  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(and(eq(Budgets.id, Number(id)), eq(Budgets.createdBy, email)))
  if (!owned.length) throw new Error('Budget not found or unauthorized')

  await db.delete(Expenses).where(eq(Expenses.budgetId, Number(id)))
  return db.delete(Budgets).where(eq(Budgets.id, Number(id))).returning()
}
