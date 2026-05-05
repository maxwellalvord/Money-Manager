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

export async function getBudgetsWithSpend() {
  const email = await getEmail()
  return db.select({
    ...getTableColumns(Budgets),
    totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
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
    totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
    totalItem: sql`count(${Expenses.id})`.mapWith(Number),
  }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .where(eq(Budgets.id, Number(id)))
    .groupBy(Budgets.id)
  return result[0] ?? null
}

export async function createBudget({ name, amount, icon }) {
  const email = await getEmail()
  return db.insert(Budgets)
    .values({ name, amount, createdBy: email, icon })
    .returning({ insertedId: Budgets.id })
}

export async function updateBudget(id, { name, amount, icon }) {
  const email = await getEmail()
  return db.update(Budgets)
    .set({ name, amount: Number(amount), icon })
    .where(eq(Budgets.id, Number(id)))
    .where(eq(Budgets.createdBy, email))
    .returning()
}

export async function deleteBudgetWithExpenses(id) {
  const email = await getEmail()
  const owned = await db.select({ id: Budgets.id })
    .from(Budgets)
    .where(eq(Budgets.id, Number(id)))
    .where(eq(Budgets.createdBy, email))
  if (!owned.length) throw new Error('Budget not found or unauthorized')

  await db.delete(Expenses).where(eq(Expenses.budgetId, Number(id)))
  return db.delete(Budgets).where(eq(Budgets.id, Number(id))).returning()
}
