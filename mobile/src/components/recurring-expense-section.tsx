import * as React from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { confirm } from "@/lib/confirm";
import { useAddRecurring, useDeleteRecurring, useRecurringByBudget } from "@/hooks/useRecurring";

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function RecurringExpenseSection({ budgetId }: { budgetId: number }) {
  const recurringQuery = useRecurringByBudget(budgetId);
  const addRecurring = useAddRecurring(budgetId);
  const deleteRecurring = useDeleteRecurring(budgetId);

  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [dueDay, setDueDay] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const n = Number(amount);
  const d = Number(dueDay);
  const isValid = name.trim() && n > 0 && d >= 1 && d <= 28;

  const onAdd = async () => {
    if (!isValid) return;
    setError(null);
    try {
      await addRecurring.mutateAsync({ name, amount: n, dueDay: d });
      setName("");
      setAmount("");
      setDueDay("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to add recurring expense");
    }
  };

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">Recurring Expenses</Text>

      {(recurringQuery.data ?? []).length > 0 ? (
        <View className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mb-4">
          {(recurringQuery.data ?? []).map((r, i) => (
            <View
              key={r.id}
              className={`flex-row items-center justify-between px-3 py-2.5 ${i > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}
            >
              <Text className="flex-1 font-medium text-slate-900 dark:text-white" numberOfLines={1}>{r.name}</Text>
              <Text className="text-slate-500 dark:text-slate-400 mr-3">${Number(r.amount).toFixed(2)}</Text>
              <Text className="text-slate-400 text-xs mr-3">{ordinal(r.dueDay)}</Text>
              <Pressable onPress={() => confirm("Remove Recurring Expense", `Remove "${r.name}"?`, () => deleteRecurring.mutate(r.id), "Remove")} hitSlop={8}>
                <Text className="text-red-500 text-sm font-semibold">Delete</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-slate-400 text-sm mb-4">No recurring expenses yet.</Text>
      )}

      <TextField label="Name" placeholder="e.g. Netflix" value={name} onChangeText={setName} />
      <TextField label="Amount" placeholder="e.g. 15.99" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
      <TextField label="Due day of month (1–28)" placeholder="e.g. 1" keyboardType="number-pad" value={dueDay} onChangeText={setDueDay} />

      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}

      <Button title="Add Recurring Expense" onPress={onAdd} disabled={!isValid} loading={addRecurring.isPending} />

      <Text className="text-xs text-slate-400 mt-3">
        Recurring expenses auto-apply on their due date when you continue a budget period. They're removed if you start fresh.
      </Text>
    </View>
  );
}
