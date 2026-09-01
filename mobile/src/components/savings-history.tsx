import { Pressable, Text, View } from "react-native";

import { confirm } from "@/lib/confirm";
import type { Expense } from "@/lib/types";

export function SavingsHistory({ expenses, onDelete }: { expenses: Expense[]; onDelete: (id: number) => void }) {
  return (
    <View>
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">Transfer History</Text>

      {expenses.length === 0 ? (
        <Text className="text-slate-400 text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl">
          No transfers yet. Use the form above to move savings into a budget.
        </Text>
      ) : (
        <View className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {expenses.map((expense, i) => {
            const destination = expense.name?.replace(/^Transfer\s*→\s*/, "") ?? expense.name;
            const date = expense.createdAt ? new Date(expense.createdAt) : null;
            return (
              <View
                key={expense.id}
                className={`flex-row items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}
              >
                <View className="flex-1 pr-2">
                  <Text className="font-medium text-slate-900 dark:text-white" numberOfLines={1}>→ {destination}</Text>
                  {date ? <Text className="text-xs text-slate-400 mt-0.5">{date.toLocaleDateString()}</Text> : null}
                </View>
                <Text className="font-semibold text-amber-600 mr-3">${Number(expense.amount).toFixed(2)}</Text>
                <Pressable onPress={() => confirm("Remove Record", "Remove this transfer record?", () => onDelete(expense.id), "Remove")} hitSlop={8}>
                  <Text className="text-red-500 text-sm font-semibold">Delete</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
