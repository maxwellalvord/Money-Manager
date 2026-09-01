import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Budget } from "@/lib/types";
import { confirm } from "@/lib/confirm";

export function BudgetItem({ budget, onDelete }: { budget: Budget; onDelete?: (id: number) => void }) {
  const router = useRouter();
  const isSavings = budget.isSavings === 1;
  const spent = Number(budget.totalSpend) || 0;
  const total = Number(budget.amount) || 0;
  const remaining = total - spent;
  const progress = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  return (
    <Pressable
      onPress={() => router.push(`/(tabs)/budgets/${budget.id}`)}
      className={`p-4 border rounded-xl mb-3 ${isSavings ? "border-amber-400 bg-amber-50/40 dark:bg-amber-900/10" : "border-slate-200 dark:border-slate-800"}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <View className={`w-11 h-11 rounded-full items-center justify-center ${isSavings ? "bg-amber-100" : "bg-slate-100 dark:bg-slate-800"}`}>
            <Text className="text-xl">{budget.icon}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <Text className="font-bold text-slate-900 dark:text-white">{budget.name}</Text>
              {isSavings ? (
                <Text className="text-[10px] bg-amber-400 text-amber-900 font-semibold px-1.5 py-0.5 rounded">SAVINGS</Text>
              ) : null}
              {budget.isDefaultSavings === 1 ? (
                <Text className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">DEFAULT</Text>
              ) : null}
            </View>
            <Text className="text-xs text-slate-400 mt-0.5">{budget.totalItem ?? 0} item(s)</Text>
          </View>
        </View>
        <Text className={`font-bold text-lg ${isSavings ? "text-amber-600" : "text-blue-600"}`}>${total.toLocaleString()}</Text>
      </View>

      <View className="mt-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-slate-400">
            ${spent.toFixed(2)} {isSavings ? "Used" : "Spent"}
          </Text>
          <Text className="text-xs text-slate-400">
            ${remaining.toFixed(2)} {isSavings ? "Available" : "Remaining"}
          </Text>
        </View>
        <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <View className={`h-2 rounded-full ${isSavings ? "bg-amber-400" : "bg-blue-600"}`} style={{ width: `${progress}%` }} />
        </View>
      </View>

      {onDelete ? (
        <Pressable
          onPress={() =>
            confirm("Delete Budget", `Delete "${budget.name}"? This will also delete all associated expenses.`, () => onDelete(budget.id), "Delete")
          }
          className="absolute top-2 right-2 bg-red-100 dark:bg-red-950/60 rounded-md px-2 py-1"
          hitSlop={8}
        >
          <Text className="text-red-500 text-xs font-semibold">Delete</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}
