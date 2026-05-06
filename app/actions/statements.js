"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { MonthlyStatements } from '@/utils/schema'
import { desc, eq } from 'drizzle-orm'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  const email = primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
  if (!email) throw new Error('No email address found for user')
  return email
}

export async function saveMonthlyStatement({ periodLabel, periodEnd, monthlyBudget, totalSpent, savedAmount, budgetBreakdown }) {
  const email = await getEmail()
  return db.insert(MonthlyStatements).values({
    email,
    periodLabel,
    periodEnd,
    monthlyBudget: String(monthlyBudget),
    totalSpent: String(totalSpent),
    savedAmount: String(savedAmount),
    budgetBreakdown: JSON.stringify(budgetBreakdown),
  })
}

export async function getLatestStatement() {
  const email = await getEmail()
  const rows = await db.select()
    .from(MonthlyStatements)
    .where(eq(MonthlyStatements.email, email))
    .orderBy(desc(MonthlyStatements.id))
    .limit(1)

  if (!rows.length) return null

  const row = rows[0]
  return {
    ...row,
    monthlyBudget: Number(row.monthlyBudget),
    totalSpent: Number(row.totalSpent),
    savedAmount: Number(row.savedAmount),
    budgetBreakdown: JSON.parse(row.budgetBreakdown),
  }
}
