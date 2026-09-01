// Mirrors utils/schema.jsx and the shapes returned by app/actions/* (via app/api/v1/*).

export type Budget = {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
  isSavings: number | null;
  isDefaultSavings: number | null;
  savingsGoal: string | null;
  dueDate: string | null;
  isOverride: number | null;
  totalSpend?: number;
  totalItem?: number;
};

export type Expense = {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdBy: string | null;
  createdAt: string;
  isOverride: number | null;
};

export type UserSettings = {
  id: number;
  email: string;
  monthlyBudget: string;
  budgetEndDay: number | null;
  budgetPeriodStart: string | null;
  savingsGoal: string | null;
};

export type RecurringExpense = {
  id: number;
  name: string;
  amount: string;
  budgetId: number;
  createdBy: string;
  dueDay: number;
  lastAppliedAt: string | null;
};

export type MonthlyStatement = {
  id: number;
  email: string;
  periodLabel: string;
  periodEnd: string;
  monthlyBudget: number;
  totalSpent: number;
  savedAmount: number;
  budgetBreakdown: Array<{
    name: string;
    icon: string | null;
    amount: number;
    totalSpend: number;
    budgetOverride: boolean;
    overrideCount: number;
    overrideAmount: number;
    expenses: Array<{ name: string; amount: number; createdAt: string; isOverride: number }>;
  }>;
};
