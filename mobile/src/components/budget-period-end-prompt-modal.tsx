import * as React from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useDeleteAllNonSavingsBudgets } from "@/hooks/useBudgets";
import { useUpdateSettings } from "@/hooks/useSettings";
import { useTriggerMonthEnd } from "@/hooks/useSavings";
import type { UserSettings } from "@/lib/types";

export function BudgetPeriodEndPromptModal({
  visible,
  settings,
  onDismiss,
}: {
  visible: boolean;
  settings: UserSettings | null;
  onDismiss: () => void;
}) {
  const [mode, setMode] = React.useState<"choose" | "new">("choose");
  const [newAmount, setNewAmount] = React.useState(String(settings?.monthlyBudget ?? ""));
  const [error, setError] = React.useState<string | null>(null);

  const triggerMonthEnd = useTriggerMonthEnd();
  const deleteAllNonSavings = useDeleteAllNonSavingsBudgets();
  const updateSettings = useUpdateSettings();

  React.useEffect(() => {
    if (visible) {
      setMode("choose");
      setNewAmount(String(settings?.monthlyBudget ?? ""));
      setError(null);
    }
  }, [visible]);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toLocaleString("default", { month: "long" });

  const onContinue = async () => {
    setError(null);
    try {
      await triggerMonthEnd.mutateAsync();
      onDismiss();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update budget period");
    }
  };

  const onStartFresh = async () => {
    const parsed = Number(newAmount);
    if (!parsed || parsed <= 0) return;
    setError(null);
    try {
      await triggerMonthEnd.mutateAsync();
      await deleteAllNonSavings.mutateAsync();
      await updateSettings.mutateAsync({ monthlyBudget: parsed });
      onDismiss();
    } catch (err: any) {
      setError(err?.message ?? "Failed to start new budget period");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/50 p-6">
        <View className="w-full bg-white dark:bg-slate-950 rounded-2xl p-5">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-1">Budget Period Ended</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Your {prevMonth} budget period ended on day {settings?.budgetEndDay}. Start a new budget or continue with last month's settings?
          </Text>

          {mode === "choose" ? (
            <View className="gap-3">
              <Pressable onPress={onContinue} className="border border-slate-300 dark:border-slate-700 rounded-xl p-4">
                <Text className="font-semibold text-slate-900 dark:text-white">Continue with Last Month's Budget</Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Keep ${Number(settings?.monthlyBudget ?? 0).toLocaleString()} for {month}
                </Text>
              </Pressable>

              <Pressable onPress={() => setMode("new")} className="bg-blue-600 rounded-xl p-4">
                <Text className="font-semibold text-white">Start Fresh</Text>
                <Text className="text-xs text-blue-100 mt-0.5">New amount, clear all budgets for {month}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <TextField label="New Monthly Budget ($)" placeholder="e.g. 3000" keyboardType="decimal-pad" value={newAmount} onChangeText={setNewAmount} />
              {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}
              <Button title={`Start ${month}`} onPress={onStartFresh} disabled={!newAmount || Number(newAmount) <= 0} loading={triggerMonthEnd.isPending} />
              <View className="mt-2">
                <Button title="Back" variant="outline" onPress={() => setMode("choose")} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
