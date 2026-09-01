import { BarChart } from "react-native-gifted-charts";
import { Text, View, useColorScheme } from "react-native";

import type { Budget } from "@/lib/types";

export function BarChartDash({ budgets }: { budgets: Budget[] }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const stackData = budgets
    .filter((b) => !b.isSavings)
    .map((b) => {
      const amount = Number(b.amount) || 0;
      const spent = Number(b.totalSpend) || 0;
      const spentSeg = Math.min(spent, amount);
      const availableSeg = Math.max(0, amount - spent);
      const overSeg = Math.max(0, spent - amount);
      const stacks = [{ value: spentSeg, color: "#4338ca" }];
      if (overSeg > 0) {
        stacks.push({ value: overSeg, color: "#ef4444" });
      } else {
        stacks.push({ value: availableSeg, color: isDark ? "#475569" : "#cbd5e1" });
      }
      return { stacks, label: b.name };
    });

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-4">Budget Activity</Text>
      {stackData.length === 0 ? (
        <Text className="text-slate-400 text-sm py-8 text-center">No budgets yet.</Text>
      ) : (
        <BarChart
          stackData={stackData}
          barWidth={26}
          spacing={22}
          roundedTop
          noOfSections={4}
          yAxisTextStyle={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }}
          rulesColor={isDark ? "#334155" : "#e2e8f0"}
          xAxisColor={isDark ? "#334155" : "#e2e8f0"}
          yAxisColor={isDark ? "#334155" : "#e2e8f0"}
        />
      )}
    </View>
  );
}
