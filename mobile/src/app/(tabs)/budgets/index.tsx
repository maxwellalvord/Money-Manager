import * as React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { BudgetItem } from "@/components/budget-item";
import { CreateBudgetModal } from "@/components/create-budget-modal";
import { useBudgets, useDeleteBudget } from "@/hooks/useBudgets";
import { useSettings } from "@/hooks/useSettings";

export default function BudgetsListScreen() {
  const budgetsQuery = useBudgets();
  const settingsQuery = useSettings();
  const deleteBudget = useDeleteBudget();
  const [createOpen, setCreateOpen] = React.useState(false);

  const monthlyBudget = Number(settingsQuery.data?.[0]?.monthlyBudget ?? 0);
  const totalAllocated = (budgetsQuery.data ?? []).filter((b) => !b.isSavings).reduce((sum, b) => sum + Number(b.amount), 0);
  const remainingToAllocate = monthlyBudget - totalAllocated;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="p-4">
      {monthlyBudget > 0 ? (
        <View className="mb-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
          <View className="flex-row justify-between mb-2">
            <View>
              <Text className="text-xs text-slate-400">Monthly Budget</Text>
              <Text className="font-bold text-slate-900 dark:text-white">${monthlyBudget.toLocaleString()}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Allocated</Text>
              <Text className="font-bold text-slate-900 dark:text-white">${totalAllocated.toLocaleString()}</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400">Remaining</Text>
              <Text className={`font-bold ${remainingToAllocate < 0 ? "text-red-500" : "text-green-600"}`}>${remainingToAllocate.toLocaleString()}</Text>
            </View>
          </View>
          <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <View
              className={`h-2 rounded-full ${totalAllocated > monthlyBudget ? "bg-red-500" : "bg-blue-600"}`}
              style={{ width: `${Math.min((totalAllocated / Math.max(monthlyBudget, 1)) * 100, 100)}%` }}
            />
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={() => setCreateOpen(true)}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-6 items-center mb-4"
      >
        <Text className="text-3xl text-slate-400">+</Text>
        <Text className="text-slate-500 dark:text-slate-400">Create New Budget</Text>
      </Pressable>

      {budgetsQuery.isLoading ? (
        <ActivityIndicator />
      ) : budgetsQuery.error ? (
        <Text className="text-red-500">{(budgetsQuery.error as Error).message}</Text>
      ) : (
        (budgetsQuery.data ?? []).map((budget) => (
          <BudgetItem key={budget.id} budget={budget} onDelete={(id) => deleteBudget.mutate(id)} />
        ))
      )}

      <CreateBudgetModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        monthlyBudget={monthlyBudget}
        totalAllocated={totalAllocated}
      />
    </ScrollView>
  );
}
