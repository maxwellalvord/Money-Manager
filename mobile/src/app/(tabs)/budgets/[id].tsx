import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { AddExpense } from "@/components/add-expense";
import { BudgetItem } from "@/components/budget-item";
import { Button } from "@/components/ui/button";
import { CreateSavingsModal } from "@/components/create-savings-modal";
import { EditBudgetModal } from "@/components/edit-budget-modal";
import { ExpenseList } from "@/components/expense-list";
import { RecurringExpenseSection } from "@/components/recurring-expense-section";
import { SavingsGoalCard } from "@/components/savings-goal-card";
import { SavingsHistory } from "@/components/savings-history";
import { SavingsTransfer } from "@/components/savings-transfer";
import { useBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useDeleteExpense, useExpensesByBudget } from "@/hooks/useExpenses";
import { confirm } from "@/lib/confirm";

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const budgetQuery = useBudget(id);
  const expensesQuery = useExpensesByBudget(id);
  const deleteBudget = useDeleteBudget();
  const deleteExpense = useDeleteExpense();

  const [editOpen, setEditOpen] = React.useState(false);
  const [createSavingsOpen, setCreateSavingsOpen] = React.useState(false);

  const budget = budgetQuery.data;

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: budget?.name ?? "Budget" });
  }, [navigation, budget?.name]);

  if (budgetQuery.isLoading || !budget) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator />
      </View>
    );
  }

  const onDeleteBudget = () => {
    confirm("Delete Budget", `Delete "${budget.name}" and all its expenses? This can't be undone.`, async () => {
      await deleteBudget.mutateAsync(budget.id);
      router.back();
    }, "Delete");
  };

  const isSavings = budget.isSavings === 1;
  const savingsRemaining = Math.max(0, Number(budget.amount) - Number(budget.totalSpend || 0));

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="p-4 gap-4">
      {isSavings ? (
        <>
          <View className="flex-row gap-2">
            <Button title="+ New Savings Account" variant="outline" onPress={() => setCreateSavingsOpen(true)} />
          </View>
          <BudgetItem budget={budget} />
          <SavingsGoalCard budget={budget} />
          <SavingsTransfer savingsBudgetId={budget.id} savingsRemaining={savingsRemaining} />
          <SavingsHistory expenses={expensesQuery.data ?? []} onDelete={(expId) => deleteExpense.mutate(expId)} />
        </>
      ) : (
        <>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button title="Edit Budget" variant="outline" onPress={() => setEditOpen(true)} />
            </View>
          </View>
          <BudgetItem budget={budget} />
          <AddExpense budget={budget} budgetId={budget.id} />
          <RecurringExpenseSection budgetId={budget.id} />
          <ExpenseList expenses={expensesQuery.data ?? []} onDelete={(expId) => deleteExpense.mutate(expId)} />
        </>
      )}

      <Button title="Delete Budget" variant="destructive" onPress={onDeleteBudget} />

      <EditBudgetModal visible={editOpen} onClose={() => setEditOpen(false)} budget={budget} />
      <CreateSavingsModal visible={createSavingsOpen} onClose={() => setCreateSavingsOpen(false)} />
    </ScrollView>
  );
}
