import * as React from "react";
import { Modal, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { DayPicker } from "@/components/day-picker";
import { TextField } from "@/components/ui/text-field";
import { useCreateSettings } from "@/hooks/useSettings";

export function SetMonthlyBudgetModal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [amount, setAmount] = React.useState("");
  const [endDay, setEndDay] = React.useState<number | null>(null);
  const [savingsGoal, setSavingsGoal] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const createSettings = useCreateSettings();

  const onSave = async () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || !endDay) return;
    setError(null);
    try {
      const goalParsed = Number(savingsGoal);
      await createSettings.mutateAsync({
        monthlyBudget: parsed,
        budgetEndDay: endDay,
        budgetPeriodStart: new Date().toISOString(),
        ...(goalParsed > 0 ? { savingsGoal: goalParsed } : {}),
      });
      onDone();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save budget");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/50 p-6">
        <View className="w-full bg-white dark:bg-slate-950 rounded-2xl p-5">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {step === 1 ? "Set Your Monthly Budget" : step === 2 ? "Choose Your Budget End Day" : "Set a Savings Goal"}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {step === 1
              ? "Enter your total monthly budget. Individual budgets come out of this amount."
              : step === 2
              ? "Pick the day of the month your budget period ends."
              : "Optionally set a savings target (you can change this later)."}
          </Text>

          {step === 1 ? (
            <>
              <TextField label="Total Monthly Budget ($)" placeholder="e.g. 3000" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
              <Button title="Next" onPress={() => setStep(2)} disabled={!amount || Number(amount) <= 0} />
            </>
          ) : step === 2 ? (
            <>
              <DayPicker selected={endDay} onSelect={setEndDay} />
              {endDay ? (
                <Text className="text-sm text-center text-slate-500 dark:text-slate-400 my-3">
                  Budget period ends on day <Text className="font-bold text-slate-900 dark:text-white">{endDay}</Text> each month.
                </Text>
              ) : (
                <View className="my-2" />
              )}
              <Button title="Next" onPress={() => setStep(3)} disabled={!endDay} />
              <View className="mt-2">
                <Button title="Back" variant="outline" onPress={() => setStep(1)} />
              </View>
            </>
          ) : (
            <>
              <TextField
                label="Savings Goal Amount ($) — optional"
                placeholder="e.g. 10000"
                keyboardType="decimal-pad"
                value={savingsGoal}
                onChangeText={setSavingsGoal}
              />
              {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}
              <Button
                title={savingsGoal && Number(savingsGoal) > 0 ? "Set Budget & Goal" : "Set Budget"}
                onPress={onSave}
                loading={createSettings.isPending}
              />
              <View className="mt-2">
                <Button title="Back" variant="outline" onPress={() => setStep(2)} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
