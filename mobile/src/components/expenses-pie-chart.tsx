import { PieChart } from "react-native-gifted-charts";
import { Text, View } from "react-native";

import type { Budget } from "@/lib/types";

const COLORS = ["#534AB7", "#1D9E75", "#BA7517", "#D4537E", "#378ADD", "#639922"];

export function ExpensesPieChart({ budgets }: { budgets: Budget[] }) {
  const pieData = budgets
    .filter((b) => !b.isSavings && (b.totalSpend ?? 0) > 0)
    .map((b, i) => ({ value: b.totalSpend ?? 0, color: COLORS[i % COLORS.length], name: b.name, icon: b.icon }));

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-4">Spending by Budget</Text>

      {pieData.length === 0 ? (
        <Text className="text-slate-400 text-sm text-center py-10">No spending data yet.</Text>
      ) : (
        <>
          <View className="items-center mb-4">
            <PieChart data={pieData} donut radius={90} innerRadius={55} />
          </View>
          <View className="gap-2">
            {pieData.map((entry, i) => (
              <View key={i} className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                <Text className="flex-1 text-slate-600 dark:text-slate-300 text-sm">{entry.icon} {entry.name}</Text>
                <Text className="font-medium text-slate-900 dark:text-white text-sm">${Number(entry.value).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
