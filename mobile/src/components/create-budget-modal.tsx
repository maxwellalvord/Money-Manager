import * as React from "react";
import { Pressable, Switch, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import { TextField } from "@/components/ui/text-field";
import { useCreateBudget } from "@/hooks/useBudgets";

const PRESET_ICONS = ["🛒", "🍔", "🚗", "🏠", "🎬", "💊", "✈️", "📱", "🎓", "🐶"];

export function CreateBudgetModal({
  visible,
  onClose,
  monthlyBudget,
  totalAllocated,
}: {
  visible: boolean;
  onClose: () => void;
  monthlyBudget: number;
  totalAllocated: number;
}) {
  const [icon, setIcon] = React.useState("🛒");
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [overrideBudget, setOverrideBudget] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createBudget = useCreateBudget();

  const remainingToAllocate = monthlyBudget - totalAllocated;
  const enteredAmount = Number(amount);
  const exceedsRemaining = monthlyBudget > 0 && enteredAmount > remainingToAllocate;
  const isDisabled = !(name && amount) || (exceedsRemaining && !overrideBudget);

  const reset = () => {
    setName("");
    setAmount("");
    setDueDate("");
    setIcon("🛒");
    setOverrideBudget(false);
    setError(null);
  };

  const onSubmit = async () => {
    setError(null);
    try {
      await createBudget.mutateAsync({ name, amount: enteredAmount, icon, dueDate: dueDate || undefined, isOverride: overrideBudget ? 1 : 0 });
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create budget");
    }
  };

  return (
    <FormModal visible={visible} onClose={() => { reset(); onClose(); }} title="Create New Budget">
      {monthlyBudget > 0 ? (
        <View className="mb-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg gap-1">
          <View className="flex-row justify-between">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">Monthly Budget</Text>
            <Text className="font-semibold text-slate-900 dark:text-white">${monthlyBudget.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">Already Allocated</Text>
            <Text className="font-semibold text-slate-900 dark:text-white">${totalAllocated.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between border-t border-slate-200 dark:border-slate-800 pt-1">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">Available to Allocate</Text>
            <Text className={`font-bold ${remainingToAllocate <= 0 ? "text-red-500" : "text-green-600"}`}>${remainingToAllocate.toLocaleString()}</Text>
          </View>
        </View>
      ) : null}

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
      <TextField label="Budget Amount" placeholder="e.g. 500" keyboardType="decimal-pad" value={amount} onChangeText={(v) => { setAmount(v); setOverrideBudget(false); }} />

      {exceedsRemaining ? (
        <View className="mb-3">
          <Text className="text-red-500 text-xs mb-2">Exceeds your remaining monthly budget of ${remainingToAllocate.toLocaleString()}</Text>
          <View className="flex-row items-center gap-2 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            <Switch value={overrideBudget} onValueChange={setOverrideBudget} />
            <Text className="text-amber-700 dark:text-amber-400 text-sm flex-1">Override allocation limit</Text>
          </View>
        </View>
      ) : null}

      <TextField label="Due Date (optional, YYYY-MM-DD)" placeholder="2026-09-15" value={dueDate} onChangeText={setDueDate} />

      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}

      <Button title="Create Budget" onPress={onSubmit} disabled={isDisabled} loading={createBudget.isPending} />
    </FormModal>
  );
}
