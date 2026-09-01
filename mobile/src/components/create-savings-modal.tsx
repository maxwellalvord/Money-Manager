import * as React from "react";
import { useRouter } from "expo-router";
import { Text } from "react-native";

import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/ui/form-modal";
import { TextField } from "@/components/ui/text-field";
import { useCreateSavingsBudget } from "@/hooks/useSavings";

export function CreateSavingsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("🏦");
  const [goal, setGoal] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const createSavings = useCreateSavingsBudget();
  const router = useRouter();

  const isValid = name.trim().length > 0;

  const onCreate = async () => {
    if (!isValid) return;
    setError(null);
    try {
      const budget = await createSavings.mutateAsync({ name: name.trim(), icon: icon.trim() || "🏦", savingsGoal: goal ? Number(goal) : undefined });
      setName("");
      setIcon("🏦");
      setGoal("");
      onClose();
      router.push(`/(tabs)/budgets/${budget.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create savings account");
    }
  };

  return (
    <FormModal visible={visible} onClose={onClose} title="New Savings Account">
      <TextField label="Account Name" placeholder="e.g. Emergency Fund" value={name} onChangeText={setName} />
      <TextField label="Emoji" placeholder="🏦" value={icon} onChangeText={setIcon} />
      <TextField label="Savings Goal (optional)" placeholder="e.g. 5000" keyboardType="decimal-pad" value={goal} onChangeText={setGoal} />
      {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}
      <Button title="Create" onPress={onCreate} disabled={!isValid} loading={createSavings.isPending} />
    </FormModal>
  );
}
