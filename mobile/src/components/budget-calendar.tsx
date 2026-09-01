import { Calendar } from "react-native-calendars";
import { Text, View, useColorScheme } from "react-native";

import type { Budget } from "@/lib/types";

const DOT_COLORS = ["#a855f7", "#ec4899", "#14b8a6", "#f87171", "#f59e0b", "#818cf8"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function BudgetCalendar({ budgetEndDay, budgets }: { budgetEndDay: number | null; budgets: Budget[] }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const todayKey = `${todayYear}-${pad(todayMonth + 1)}-${pad(todayDate)}`;

  const daysInCurrentMonth = new Date(todayYear, todayMonth + 1, 0).getDate();
  const endDay = budgetEndDay ? Math.min(budgetEndDay, daysInCurrentMonth) : null;
  const wrapsToNextMonth = endDay !== null && endDay < todayDate;
  const endDayKey = endDay !== null ? `${todayYear}-${pad(todayMonth + 1)}-${pad(endDay)}` : null;

  let daysRemaining: number | null = null;
  if (endDay !== null) {
    if (!wrapsToNextMonth) {
      daysRemaining = endDay - todayDate;
    } else {
      const nextMonthDays = new Date(todayYear, todayMonth + 2, 0).getDate();
      daysRemaining = daysInCurrentMonth - todayDate + Math.min(budgetEndDay!, nextMonthDays);
    }
  }

  const dueBudgets = budgets
    .filter((b) => !b.isSavings && b.dueDate)
    .map((b, idx) => ({ ...b, dueDay: Math.min(new Date(b.dueDate + "T00:00:00").getDate(), daysInCurrentMonth), colorIdx: idx % DOT_COLORS.length }));

  const markedDates: Record<string, any> = {};
  if (endDayKey) {
    markedDates[endDayKey] = { selected: true, selectedColor: "#f97316" };
  }
  markedDates[todayKey] = { ...(markedDates[todayKey] ?? {}), selected: true, selectedColor: "#2563eb" };

  for (const b of dueBudgets) {
    const key = `${todayYear}-${pad(todayMonth + 1)}-${pad(b.dueDay)}`;
    const existing = markedDates[key] ?? {};
    const dots = existing.dots ?? [];
    dots.push({ key: String(b.id), color: DOT_COLORS[b.colorIdx] });
    markedDates[key] = { ...existing, dots };
  }

  return (
    <View className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">Budget Calendar</Text>

      <Calendar
        current={todayKey}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: isDark ? "#94a3b8" : "#64748b",
          dayTextColor: isDark ? "#e2e8f0" : "#0f172a",
          monthTextColor: isDark ? "#e2e8f0" : "#0f172a",
          todayTextColor: "#2563eb",
          arrowColor: "#2563eb",
          textDisabledColor: isDark ? "#334155" : "#cbd5e1",
        }}
      />

      <View className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 gap-2">
        <View className="flex-row flex-wrap gap-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full bg-blue-600" />
            <Text className="text-xs text-slate-400">Today</Text>
          </View>
          {endDay ? (
            <View className="flex-row items-center gap-1.5">
              <View className="w-3 h-3 rounded-full bg-orange-500" />
              <Text className="text-xs text-slate-400">Period ends</Text>
            </View>
          ) : null}
        </View>

        {dueBudgets.map((b) => (
          <View key={b.id} className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: DOT_COLORS[b.colorIdx] }} />
            <Text className="text-xs text-slate-400 flex-1">
              {b.icon} {b.name} — due day {b.dueDay}
            </Text>
          </View>
        ))}

        {endDay ? (
          <Text className="text-sm font-medium text-green-600">
            {daysRemaining === 0
              ? "Budget period ends today!"
              : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining in budget period`}
          </Text>
        ) : (
          <Text className="text-xs text-slate-400">No budget end day set. Set one from Settings.</Text>
        )}
      </View>
    </View>
  );
}
