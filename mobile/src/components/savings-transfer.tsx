import * as React from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useNonSavingsBudgets, useTransferFromSavings } from "@/hooks/useSavings";

export function SavingsTransfer({ savingsBudgetId, savingsRemaining }: { savingsBudgetId: number; savingsRemaining: number }) {
  const budgetsQuery = useNonSavingsBudgets();
  const transfer = useTransferFromSavings(savingsBudgetId);

  const [selectedBudgetId, setSelectedBudgetId] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const selectedBudget = (budgetsQuery.data ?? []).find((b) => b.id === selectedBudgetId);
  const numAmount = Number(amount);
  const exceedsBalance = amount !== "" && numAmount > savingsRemaining;
  const isValid = !!selectedBudgetId && numAmount > 0 && !exceedsBalance;

  const onTransfer = async () => {
    if (!isValid || !selectedBudget) return;
    setError(null);
    try {
      await transfer.mutateAsync({ targetBudgetId: selectedBudget.id, amount: numAmount, targetBudgetName: selectedBudget.name });
      setAmount("");
      setSelectedBudgetId(null);
    } catch (err: any) {
      setError(err?.message ?? "Transfer failed");
    }
  };

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-1">Transfer to Budget</Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Available: <Text className="font-semibold text-slate-900 dark:text-white">${savingsRemaining.toFixed(2)}</Text>
      </Text>

      <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Select Budget</Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {(budgetsQuery.data ?? []).map((b) => (
          <Pressable
            key={b.id}
            onPress={() => setSelectedBudgetId(b.id)}
            className={`px-3 py-2 rounded-lg border ${selectedBudgetId === b.id ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800"}`}
          >
            <Text className="text-slate-900 dark:text-white">{b.icon} {b.name}</Text>
          </Pressable>
        ))}
        {(budgetsQuery.data ?? []).length === 0 ? <Text className="text-slate-400 text-sm">No budgets to transfer into yet.</Text> : null}
      </View>

      <TextField label="Amount" placeholder="e.g. 100" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
      {exceedsBalance ? <Text className="text-red-500 text-sm -mt-2 mb-3">Exceeds available savings (${savingsRemaining.toFixed(2)})</Text> : null}
      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}

      <Button title="Transfer to Budget" onPress={onTransfer} disabled={!isValid} loading={transfer.isPending} />
    </View>
  );
}
