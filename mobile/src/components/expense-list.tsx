import { Pressable, Text, View } from "react-native";

import { confirm } from "@/lib/confirm";
import type { Expense } from "@/lib/types";

export function ExpenseList({
  expenses,
  onDelete,
  title = "Latest Expenses",
}: {
  expenses: Expense[];
  onDelete: (id: number) => void;
  title?: string;
}) {
  if (expenses.length === 0) {
    return <Text className="text-slate-400 text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl">No expenses yet.</Text>;
  }

  return (
    <View>
      <Text className="font-bold text-lg text-slate-900 dark:text-white mb-3">{title}</Text>
      <View className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        {expenses.map((expense, i) => {
          const isSavingsCredit = expense.isOverride === 2;
          const date = expense.createdAt ? new Date(expense.createdAt) : null;
          return (
            <View
              key={expense.id}
              className={`flex-row items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""} ${isSavingsCredit ? "bg-green-50 dark:bg-green-900/10" : ""}`}
            >
              <View className="flex-1 pr-2">
                <Text className={`font-medium ${isSavingsCredit ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`} numberOfLines={1}>
                  {expense.name}
                </Text>
                {date ? <Text className="text-xs text-slate-400 mt-0.5">{date.toDateString()}</Text> : null}
              </View>
              <Text className={`font-semibold mr-3 ${isSavingsCredit ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`}>
                {isSavingsCredit ? "+" : ""}${Number(expense.amount).toFixed(2)}
              </Text>
              <Pressable onPress={() => confirm("Delete Expense", `Delete "${expense.name}"?`, () => onDelete(expense.id), "Delete")} hitSlop={8}>
                <Text className="text-red-500 text-sm font-semibold">Delete</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
