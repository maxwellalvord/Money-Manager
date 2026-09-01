import { useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { BarChartDash } from "@/components/bar-chart-dash";
import { BudgetCalendar } from "@/components/budget-calendar";
import { BudgetItem } from "@/components/budget-item";
import { ExpenseList } from "@/components/expense-list";
import { MonthlyStatement } from "@/components/monthly-statement";
import { useBudgets, useDeleteBudget } from "@/hooks/useBudgets";
import { useAllExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import { useApplyDueRecurring } from "@/hooks/useRecurring";
import { useSettings } from "@/hooks/useSettings";
import { useLatestStatement } from "@/hooks/useStatements";

export default function DashboardScreen() {
  const { user } = useUser();

  const applyDueRecurring = useApplyDueRecurring();
  React.useEffect(() => {
    applyDueRecurring.mutate();
    // Runs once per mount, mirroring the web dashboard's load-time side effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settingsQuery = useSettings();
  const budgetsQuery = useBudgets();
  const expensesQuery = useAllExpenses();
  const statementQuery = useLatestStatement();
  const deleteExpense = useDeleteExpense();
  const deleteBudget = useDeleteBudget();

  const monthlyBudget = Number(settingsQuery.data?.[0]?.monthlyBudget ?? 0);
  const budgetEndDay = settingsQuery.data?.[0]?.budgetEndDay ?? null;
  const budgets = budgetsQuery.data ?? [];

  const totalAllocated = budgets.filter((b) => !b.isSavings).reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpend = budgets.filter((b) => !b.isSavings).reduce((sum, b) => sum + (b.totalSpend ?? 0), 0);
  const remainingMonthly = monthlyBudget - totalSpend;

  const loading = settingsQuery.isLoading || budgetsQuery.isLoading;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="p-4 gap-4">
      <View>
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Welcome, {user?.firstName ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "Budgeter"}!
        </Text>
        <Text className="text-slate-500 dark:text-slate-400">Here's a quick breakdown of your budgets.</Text>
      </View>

      {loading ? (
        <ActivityIndicator className="mt-4" />
      ) : (
        <>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Monthly Budget</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">${monthlyBudget.toLocaleString()}</Text>
              <Text className="text-xs text-slate-400 mt-1">${totalAllocated.toLocaleString()} allocated</Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Total Spent</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">${totalSpend.toLocaleString()}</Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400">Remaining This Month</Text>
              <Text className={`text-xl font-bold ${remainingMonthly < 0 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                ${remainingMonthly.toLocaleString()}
              </Text>
            </View>
            <View className="flex-1 min-w-[45%] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <Text className="text-xs text-slate-400"># of Budgets</Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{budgets.length}</Text>
            </View>
          </View>

          <BarChartDash budgets={budgets} />

          <ExpenseList expenses={(expensesQuery.data ?? []).slice(0, 10)} onDelete={(id) => deleteExpense.mutate(id)} />

          <BudgetCalendar budgetEndDay={budgetEndDay} budgets={budgets} />

          <View>
            <Text className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Breakdown</Text>
            <Text className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">Latest Budgets</Text>
            {budgets.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} onDelete={(id) => deleteBudget.mutate(id)} />
            ))}
          </View>

          <MonthlyStatement statement={statementQuery.data} />
        </>
      )}
    </ScrollView>
  );
}
