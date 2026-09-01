import { useClerk, useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { DayPicker } from "@/components/day-picker";
import { FormModal } from "@/components/ui/form-modal";
import { TextField } from "@/components/ui/text-field";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();
  const settings = settingsQuery.data?.[0];

  const [editOpen, setEditOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [endDay, setEndDay] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const openEdit = () => {
    setAmount(String(settings?.monthlyBudget ?? ""));
    setEndDay(settings?.budgetEndDay ?? null);
    setError(null);
    setEditOpen(true);
  };

  const onSave = async () => {
    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError(null);
    try {
      await updateSettings.mutateAsync({
        monthlyBudget: parsed,
        ...(endDay ? { budgetEndDay: endDay } : {}),
        budgetPeriodStart: new Date().toISOString(),
      });
      setEditOpen(false);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update budget");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" contentContainerClassName="p-4 gap-4">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">Settings</Text>

      <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <Text className="text-xs uppercase text-slate-400 mb-1">Signed in as</Text>
        <Text className="text-slate-900 dark:text-white">{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      {settings ? (
        <Pressable onPress={openEdit} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <Text className="text-xs uppercase text-slate-400 mb-1">Monthly Budget</Text>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">${Number(settings.monthlyBudget).toLocaleString()}</Text>
          {settings.budgetEndDay ? (
            <Text className="text-xs text-slate-400 mt-1">Ends on day {settings.budgetEndDay} each month</Text>
          ) : null}
          <Text className="text-blue-600 text-sm font-medium mt-2">Edit Monthly Budget</Text>
        </Pressable>
      ) : null}

      <Pressable onPress={() => signOut()} className="border border-red-300 dark:border-red-900 rounded-lg py-3 items-center">
        <Text className="text-red-600 font-semibold">Sign Out</Text>
      </Pressable>

      <FormModal visible={editOpen} onClose={() => setEditOpen(false)} title="Edit Monthly Budget">
        <TextField label="Total Monthly Budget ($)" placeholder="e.g. 3000" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
        <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Budget End Day</Text>
        <DayPicker selected={endDay} onSelect={setEndDay} />
        {endDay ? (
          <Text className="text-xs text-center text-slate-400 mt-2 mb-3">
            Budget period ends on day <Text className="font-bold text-slate-900 dark:text-white">{endDay}</Text> each month.
          </Text>
        ) : (
          <View className="mb-3" />
        )}
        {error ? <Text className="text-red-500 text-sm mb-2">{error}</Text> : null}
        <Button title="Save" onPress={onSave} disabled={!amount || Number(amount) <= 0} loading={updateSettings.isPending} />
      </FormModal>
    </ScrollView>
  );
}
