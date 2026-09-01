import * as React from "react";
import { Switch, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useAddExpense } from "@/hooks/useExpenses";
import type { Budget } from "@/lib/types";

export function AddExpense({ budget, budgetId }: { budget?: Budget; budgetId: number }) {
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [overrideBudget, setOverrideBudget] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const addExpense = useAddExpense();

  const remaining = budget ? Number(budget.amount) - Number(budget.totalSpend || 0) : undefined;
  const numericAmount = Number(amount);
  const isValidAmount = amount !== "" && !Number.isNaN(numericAmount) && numericAmount > 0;
  const amountWithinBudget = remaining === undefined || numericAmount <= remaining;
  const showOverrideOption = remaining !== undefined && amount !== "" && !amountWithinBudget;
  const isDisabled = !(name && isValidAmount && (amountWithinBudget || overrideBudget));

  const onSubmit = async () => {
    setError(null);
    try {
      await addExpense.mutateAsync({
        name,
        amount: numericAmount,
        budgetId,
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
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">Add Expense</Text>

      <TextField label="Expense Name" placeholder="e.g. Record Store" value={name} onChangeText={setName} />
      <TextField
        label="Expense Amount"
        placeholder="e.g. 65"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(v) => { setAmount(v); setOverrideBudget(false); }}
      />

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

      <Button title="Add New Expense" onPress={onSubmit} disabled={isDisabled} loading={addExpense.isPending} />
    </View>
  );
}
