import * as React from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import { TextField } from "@/components/ui/text-field";
import { useUpdateBudget } from "@/hooks/useBudgets";
import type { Budget } from "@/lib/types";

const PRESET_ICONS = ["🛒", "🍔", "🚗", "🏠", "🎬", "💊", "✈️", "📱", "🎓", "🐶"];

export function EditBudgetModal({ visible, onClose, budget }: { visible: boolean; onClose: () => void; budget: Budget }) {
  const [icon, setIcon] = React.useState(budget.icon ?? "😀");
  const [name, setName] = React.useState(budget.name);
  const [amount, setAmount] = React.useState(String(budget.amount));
  const [dueDate, setDueDate] = React.useState(budget.dueDate ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const updateBudget = useUpdateBudget(budget.id);

  React.useEffect(() => {
    setIcon(budget.icon ?? "😀");
    setName(budget.name);
    setAmount(String(budget.amount));
    setDueDate(budget.dueDate ?? "");
  }, [budget.id]);

  const onSave = async () => {
    setError(null);
    try {
      await updateBudget.mutateAsync({ name, amount: Number(amount), icon, dueDate: dueDate || undefined });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update budget");
    }
  };

  return (
    <FormModal visible={visible} onClose={onClose} title="Edit Your Budget">
      <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Icon</Text>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {PRESET_ICONS.map((preset) => (
          <Pressable
            key={preset}
            onPress={() => setIcon(preset)}
            className={`w-11 h-11 rounded-full items-center justify-center border ${icon === preset ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-800"}`}
          >
            <Text className="text-xl">{preset}</Text>
          </Pressable>
        ))}
      </View>

      <TextField label="Budget Name" placeholder="e.g. Groceries" value={name} onChangeText={setName} />
      <TextField label="Budget Amount" placeholder="e.g. 500" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
      <TextField label="Due Date (optional, YYYY-MM-DD)" placeholder="2026-09-15" value={dueDate} onChangeText={setDueDate} />

      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}

      <Button title="Save Changes" onPress={onSave} disabled={!(name && amount)} loading={updateBudget.isPending} />
    </FormModal>
  );
}
