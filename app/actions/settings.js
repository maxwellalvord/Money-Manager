"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { UserSettings } from '@/utils/schema'
import { eq } from 'drizzle-orm'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  const email = primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
  if (!email) throw new Error('No email address found for user')
  return email
}

function validateBudgetEndDay(day) {
  if (day === undefined || day === null) return
  const n = Number(day)
  if (!Number.isInteger(n) || n < 1 || n > 31) throw new Error('Budget end day must be between 1 and 31')
}

export async function getSettings() {
  const email = await getEmail()
  return db.select().from(UserSettings).where(eq(UserSettings.email, email))
}

export async function createSettings({ monthlyBudget, budgetEndDay, budgetPeriodStart }) {
  const email = await getEmail()
  validateBudgetEndDay(budgetEndDay)
  return db.insert(UserSettings)
    .values({ email, monthlyBudget, budgetEndDay, budgetPeriodStart })
    .returning({ id: UserSettings.id })
}

export async function updateSettings(fields) {
  const email = await getEmail()
  if (fields.budgetEndDay !== undefined) validateBudgetEndDay(fields.budgetEndDay)
  return db.update(UserSettings)
    .set(fields)
    .where(eq(UserSettings.email, email))
    .returning()
}
