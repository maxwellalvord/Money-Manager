"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm'

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

export async function getAllExpenses() {
  const email = await getEmail()
  return db.select({
    id: Expenses.id,
    name: Expenses.name,
    amount: Expenses.amount,
    createdAt: Expenses.createdAt,
  }).from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.createdAt))
}

export async function getExpensesByUser() {
  const email = await getEmail()
  return db.select().from(Expenses).where(eq(Expenses.createdBy, email))
}

export async function getBudgetsWithSpendForExpenses() {
  const email = await getEmail()
  return db.select({
    ...getTableColumns(Budgets),
    totalSpend: sql`coalesce(sum(${Expenses.amount}), 0)`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .groupBy(Budgets.id)
}

export async function getExpensesByBudget(budgetId) {
  const email = await getEmail()
  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(and(eq(Budgets.id, Number(budgetId)), eq(Budgets.createdBy, email)))
  if (!owned.length) throw new Error('Budget not found or unauthorized')

  return db.select().from(Expenses)
    .where(eq(Expenses.budgetId, Number(budgetId)))
    .orderBy(desc(Expenses.id))
}

export async function addExpense({ name, amount, budgetId, createdAt, isOverride = 0 }) {
  const email = await getEmail()
  validateName(name)
  validateAmount(amount)
  return db.insert(Expenses)
    .values({ name: name.trim(), amount, budgetId, createdBy: email, createdAt, isOverride })
    .returning({ insertedId: Expenses.id })
}

export async function deleteExpense(id) {
  const email = await getEmail()
  const owned = await db.select({ id: Expenses.id })
    .from(Expenses)
    .where(and(eq(Expenses.id, Number(id)), eq(Expenses.createdBy, email)))
  if (!owned.length) throw new Error('Expense not found or unauthorized')

  return db.delete(Expenses).where(eq(Expenses.id, Number(id))).returning()
}
