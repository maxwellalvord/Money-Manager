import * as React from "react";
import { Pressable, Text, View } from "react-native";

import type { MonthlyStatement as MonthlyStatementType } from "@/lib/types";

export function MonthlyStatement({ statement }: { statement: MonthlyStatementType | null | undefined }) {
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  if (!statement) return null;

  const { periodLabel, monthlyBudget, totalSpent, savedAmount, budgetBreakdown, periodEnd } = statement;
  const remaining = monthlyBudget - totalSpent;
  const usedPct = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0;
  const date = new Date(periodEnd).toLocaleDateString("default", { dateStyle: "medium" } as any);

  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white">Last Month's Statement</Text>
      <Text className="text-xs text-slate-400 mb-4">{periodLabel} — generated {date}</Text>

      <View className="flex-row flex-wrap gap-2 mb-4">
        <View className="flex-1 min-w-[45%] bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
          <Text className="text-xs text-slate-400">Monthly Budget</Text>
          <Text className="font-bold text-slate-900 dark:text-white">${monthlyBudget.toLocaleString()}</Text>
        </View>
        <View className="flex-1 min-w-[45%] bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
          <Text className="text-xs text-slate-400">Total Spent</Text>
          <Text className="font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</Text>
        </View>
        <View className="flex-1 min-w-[45%] bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
          <Text className="text-xs text-slate-400">Remaining</Text>
          <Text className={`font-bold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>${remaining.toFixed(2)}</Text>
        </View>
        <View className="flex-1 min-w-[45%] bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
          <Text className="text-xs text-slate-400">Moved to Savings</Text>
          <Text className="font-bold text-amber-600">${savedAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-slate-400">Overall budget used</Text>
          <Text className="text-xs text-slate-400">{usedPct.toFixed(1)}%</Text>
        </View>
        <View className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <View className={`h-2 rounded-full ${usedPct >= 100 ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${usedPct}%` }} />
        </View>
      </View>

      {budgetBreakdown.length > 0 ? (
        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget Breakdown</Text>
          {budgetBreakdown.map((b, i) => {
            const pct = b.amount > 0 ? Math.min((b.totalSpend / b.amount) * 100, 100) : 0;
            const bRemaining = b.amount - b.totalSpend;
            const isOpen = !!expanded[i];

            return (
              <View key={i} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <Pressable onPress={() => toggle(i)} className="px-3 py-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-slate-900 dark:text-white flex-1" numberOfLines={1}>{b.icon} {b.name}</Text>
                    <Text className="text-slate-400 text-xs mr-2">${b.totalSpend.toFixed(2)} / ${b.amount.toLocaleString()}</Text>
                    <Text className="text-slate-400">{isOpen ? "▲" : "▼"}</Text>
                  </View>
                  {b.budgetOverride ? <Text className="text-xs text-purple-600 mt-1">Budget exceeded monthly allocation when created</Text> : null}
                  {b.overrideCount > 0 ? (
                    <Text className="text-xs text-amber-600 mt-1">${Number(b.overrideAmount).toFixed(2)} spent via {b.overrideCount} expense override{b.overrideCount > 1 ? "s" : ""}</Text>
                  ) : null}
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <View className={`h-1.5 rounded-full ${pct >= 100 ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${pct}%` }} />
                    </View>
                    <Text className={`text-xs ${bRemaining < 0 ? "text-red-500" : "text-slate-400"}`}>
                      {bRemaining < 0 ? "-" : ""}${Math.abs(bRemaining).toFixed(2)} {bRemaining < 0 ? "over" : "left"}
                    </Text>
                  </View>
                </Pressable>

                {isOpen ? (
                  <View className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2">
                    {b.expenses.length > 0 ? (
                      b.expenses.map((exp, j) => (
                        <View key={j} className="flex-row justify-between py-1">
                          <Text className={`text-sm flex-1 ${exp.isOverride ? "text-amber-600" : "text-slate-700 dark:text-slate-300"}`} numberOfLines={1}>
                            {exp.name}
                          </Text>
                          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mx-2">${Number(exp.amount).toFixed(2)}</Text>
                          <Text className="text-xs text-slate-400">
                            {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString("default", { month: "short", day: "numeric" } as any) : "—"}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-xs text-slate-400">No expenses recorded for this budget.</Text>
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-sm text-slate-400">No individual budgets were tracked this period.</Text>
      )}
    </View>
  );
}
