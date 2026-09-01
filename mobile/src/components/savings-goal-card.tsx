import * as React from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import { TextField } from "@/components/ui/text-field";
import { useUpdateSavingsGoal } from "@/hooks/useBudgets";
import type { Budget } from "@/lib/types";

export function SavingsGoalCard({ budget }: { budget: Budget }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [goalInput, setGoalInput] = React.useState("");
  const updateGoal = useUpdateSavingsGoal(budget.id);

  const goal = Number(budget.savingsGoal) || 0;
  const saved = Number(budget.amount) || 0;
  const progress = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0;
  const remaining = Math.max(0, goal - saved);

  const openEdit = () => {
    setGoalInput(goal > 0 ? String(goal) : "");
    setEditOpen(true);
  };

  const onSave = async () => {
    const parsed = Number(goalInput);
    if (!parsed || parsed <= 0) return;
    await updateGoal.mutateAsync(parsed);
    setEditOpen(false);
  };

  const onRemove = async () => {
    await updateGoal.mutateAsync(null);
    setEditOpen(false);
  };

  return (
    <>
      {goal === 0 ? (
        <Pressable onPress={openEdit} className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 items-center justify-center h-36">
          <Text className="text-slate-400 font-medium">Set a Savings Goal</Text>
        </Pressable>
      ) : (
        <Pressable onPress={openEdit} className="border border-amber-400 bg-amber-50/40 dark:bg-amber-900/10 rounded-xl p-4 h-36 justify-between">
          <View>
            <Text className="text-xs uppercase text-slate-400 tracking-wide">Savings Goal</Text>
            <Text className="text-2xl font-bold text-amber-600">${goal.toLocaleString()}</Text>
          </View>
          <View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs text-slate-400">${saved.toFixed(2)} saved</Text>
              <Text className="text-xs text-slate-400">${remaining.toFixed(2)} to go</Text>
            </View>
            <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <View className="h-2 rounded-full bg-amber-400" style={{ width: `${progress}%` }} />
            </View>
          </View>
        </Pressable>
      )}

      <FormModal visible={editOpen} onClose={() => setEditOpen(false)} title={goal ? "Edit Savings Goal" : "Set Savings Goal"}>
        <TextField label="Goal amount" placeholder="e.g. 10000" keyboardType="decimal-pad" value={goalInput} onChangeText={setGoalInput} />
        <Button title="Save" onPress={onSave} disabled={!goalInput || Number(goalInput) <= 0} loading={updateGoal.isPending} />
        {goal > 0 ? <View className="mt-3"><Button title="Remove Goal" variant="ghost" onPress={onRemove} /></View> : null}
      </FormModal>
    </>
  );
}
