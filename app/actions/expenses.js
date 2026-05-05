"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
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
    totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .groupBy(Budgets.id)
}

export async function getExpensesByBudget(budgetId) {
  const email = await getEmail()
  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(eq(Budgets.id, Number(budgetId)))
    .where(eq(Budgets.createdBy, email))
  if (!owned.length) throw new Error('Budget not found or unauthorized')

  return db.select().from(Expenses)
    .where(eq(Expenses.budgetId, Number(budgetId)))
    .orderBy(desc(Expenses.id))
}

export async function addExpense({ name, amount, budgetId, createdAt }) {
  const email = await getEmail()
  return db.insert(Expenses)
    .values({ name, amount, budgetId, createdBy: email, createdAt })
    .returning({ insertedId: Expenses.id })
}

export async function deleteExpense(id) {
  const email = await getEmail()
  const rows = await db.select({ budgetId: Expenses.budgetId })
    .from(Expenses).where(eq(Expenses.id, Number(id)))
  if (!rows.length) throw new Error('Expense not found')

  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(eq(Budgets.id, rows[0].budgetId))
    .where(eq(Budgets.createdBy, email))
  if (!owned.length) throw new Error('Unauthorized')

  return db.delete(Expenses).where(eq(Expenses.id, Number(id))).returning()
}
