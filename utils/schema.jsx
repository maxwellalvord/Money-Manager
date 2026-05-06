import { pgTable, serial, varchar, numeric, integer, text } from "drizzle-orm/pg-core";

export const Budgets=pgTable("budgets",{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:varchar('amount').notNull(),
    icon:varchar('icon'),
    createdBy:varchar('createdBy').notNull(),
    isSavings:integer('isSavings').default(0),
    dueDate:varchar('dueDate'),
    isOverride:integer('isOverride').default(0),
})

export const Expenses = pgTable("expenses",{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    amount:numeric('amount').notNull().default(0),
    budgetId:integer('budgetId').references(() => Budgets.id),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt').notNull(),
    isOverride:integer('isOverride').default(0),
})

export const UserSettings = pgTable("user_settings", {
    id: serial('id').primaryKey(),
    email: varchar('email').notNull().unique(),
    monthlyBudget: numeric('monthlyBudget').notNull(),
    budgetEndDay: integer('budgetEndDay'),
    budgetPeriodStart: varchar('budgetPeriodStart'),
})

export const MonthlyStatements = pgTable("monthly_statements", {
    id: serial('id').primaryKey(),
    email: varchar('email').notNull(),
    periodLabel: varchar('periodLabel').notNull(),
    periodEnd: varchar('periodEnd').notNull(),
    monthlyBudget: numeric('monthlyBudget').notNull(),
    totalSpent: numeric('totalSpent').notNull(),
    savedAmount: numeric('savedAmount').notNull(),
    budgetBreakdown: text('budgetBreakdown').notNull(),
})