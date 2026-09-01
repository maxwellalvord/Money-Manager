import * as React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { ExpenseList } from "@/components/expense-list";
import { ExpensesPieChart } from "@/components/expenses-pie-chart";
import { QuickAddExpense } from "@/components/quick-add-expense";
import { useBudgetSummariesForExpenses, useDeleteExpense, useExpensesByUser } from "@/hooks/useExpenses";
import { useSettings } from "@/hooks/useSettings";

export default function ExpensesScreen() {
  const expensesQuery = useExpensesByUser();
  const budgetsQuery = useBudgetSummariesForExpenses();
  const settingsQuery = useSettings();
  const deleteExpense = useDeleteExpense();

  const expenses = expensesQuery.data ?? [];
  const budgets = budgetsQuery.data ?? [];
  const monthlyBudget = Number(settingsQuery.data?.[0]?.monthlyBudget ?? 0);

  const totalSpent = budgets.filter((b) => !b.isSavings).reduce((sum, b) => sum + Number(b.totalSpend || 0), 0);
  const budgetRemaining = monthlyBudget - totalSpent;
  const avgExpense = expenses.length ? (totalSpent / expenses.length).toFixed(2) : "0.00";

  const loading = expensesQuery.isLoading || budgetsQuery.isLoading;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="p-4 gap-4">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">My Expenses</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Total Spent</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">No. of Expenses</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{expenses.length}</Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Avg per Expense</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">${avgExpense}</Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Budget Remaining</Text>
              <Text className={`text-xl font-bold ${budgetRemaining < 0 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                ${budgetRemaining.toFixed(2)}
              </Text>
            </View>
          </View>

          <QuickAddExpense budgets={budgets} />
          <ExpensesPieChart budgets={budgets} />
          <ExpenseList expenses={expenses} onDelete={(id) => deleteExpense.mutate(id)} />
        </>
      )}
    </ScrollView>
  );
}
