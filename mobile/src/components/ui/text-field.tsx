import { Text, TextInput, TextInputProps, View } from "react-native";

export function TextField({ label, error, ...props }: TextInputProps & { label: string; error?: string | null }) {
  return (
    <View className="mb-3">
      <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</Text>
      <TextInput
        placeholderTextColor="#94a3b8"
        className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white"
        {...props}
      />
      {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
