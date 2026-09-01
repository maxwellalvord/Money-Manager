import { Pressable, Text, View } from "react-native";

export function DayPicker({ selected, onSelect }: { selected: number | null; onSelect: (day: number) => void }) {
  return (
    <View className="flex-row flex-wrap gap-1.5 mt-2">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
        <Pressable
          key={day}
          onPress={() => onSelect(day)}
          className={`w-9 h-9 rounded items-center justify-center ${selected === day ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          <Text className={`text-sm font-medium ${selected === day ? "text-white" : "text-slate-900 dark:text-white"}`}>{day}</Text>
        </Pressable>
      ))}
    </View>
  );
}
