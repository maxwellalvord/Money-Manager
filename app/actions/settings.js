"use server"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/utils/dbConfig'
import { UserSettings } from '@/utils/schema'
import { eq } from 'drizzle-orm'

async function getEmail() {
  const user = await currentUser()
  if (!user) throw new Error('Unauthorized')
  const primary = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress
}

export async function getSettings() {
  const email = await getEmail()
  return db.select().from(UserSettings).where(eq(UserSettings.email, email))
}

export async function createSettings({ monthlyBudget, budgetEndDay, budgetPeriodStart }) {
  const email = await getEmail()
  return db.insert(UserSettings)
    .values({ email, monthlyBudget, budgetEndDay, budgetPeriodStart })
    .returning({ id: UserSettings.id })
}

export async function updateSettings(fields) {
  const email = await getEmail()
  return db.update(UserSettings)
    .set(fields)
    .where(eq(UserSettings.email, email))
    .returning()
}
