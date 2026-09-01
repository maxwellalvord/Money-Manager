import * as React from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { useAddExpense } from "@/hooks/useExpenses";
import type { Budget } from "@/lib/types";

export function QuickAddExpense({ budgets }: { budgets: Budget[] }) {
  const spendingBudgets = budgets.filter((b) => !b.isSavings);
  const [selectedBudgetId, setSelectedBudgetId] = React.useState<number | null>(null);
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [overrideBudget, setOverrideBudget] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const addExpense = useAddExpense();

  const selectedBudget = spendingBudgets.find((b) => b.id === selectedBudgetId);
  const remaining = selectedBudget ? Number(selectedBudget.amount) - Number(selectedBudget.totalSpend || 0) : undefined;
  const numericAmount = Number(amount);
  const isValidAmount = amount !== "" && !Number.isNaN(numericAmount) && numericAmount > 0;
  const amountWithinBudget = remaining === undefined || numericAmount <= remaining;
  const showOverrideOption = remaining !== undefined && amount !== "" && !amountWithinBudget;
  const isDisabled = !(selectedBudgetId && name && isValidAmount && (amountWithinBudget || overrideBudget));

  const onSubmit = async () => {
    if (!selectedBudgetId) return;
    setError(null);
    try {
      await addExpense.mutateAsync({
        name,
        amount: numericAmount,
        budgetId: selectedBudgetId,
        createdAt: new Date().toISOString(),
        isOverride: overrideBudget ? 1 : 0,
      });
      setName("");
      setAmount("");
      setOverrideBudget(false);
    } catch (err: any) {
      setError(err?.message ?? "Failed to add expense");
    }
  };

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">Quick Add Expense</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row gap-2">
          {spendingBudgets.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => { setSelectedBudgetId(b.id); setOverrideBudget(false); }}
              className={`px-3 py-2 rounded-lg border ${selectedBudgetId === b.id ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800"}`}
            >
              <Text className="text-slate-900 dark:text-white">{b.icon} {b.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row gap-2 mb-2">
        <TextInput
          placeholder="Expense name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          editable={!!selectedBudgetId}
          className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white"
        />
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(v) => { setAmount(v); setOverrideBudget(false); }}
          editable={!!selectedBudgetId}
          className="w-28 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white"
        />
      </View>

      {selectedBudget ? (
        <Text className="text-xs text-slate-400 mb-2">
          {selectedBudget.icon} {selectedBudget.name} — ${Number(selectedBudget.totalSpend || 0).toFixed(2)} spent of ${Number(selectedBudget.amount).toFixed(2)} (${remaining!.toFixed(2)} remaining)
        </Text>
      ) : null}

      {showOverrideOption ? (
        <View className="mb-3">
          <Text className="text-red-500 text-xs mb-2">Amount exceeds remaining budget (${remaining!.toFixed(2)}).</Text>
          <View className="flex-row items-center gap-2 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            <Switch value={overrideBudget} onValueChange={setOverrideBudget} />
            <Text className="text-amber-700 dark:text-amber-400 text-sm flex-1">Override budget limit</Text>
          </View>
        </View>
      ) : null}

      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}

      <Button title="Add Expense" onPress={onSubmit} disabled={isDisabled} loading={addExpense.isPending} />
    </View>
  );
}
