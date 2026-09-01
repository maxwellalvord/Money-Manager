import { View, ViewProps } from "react-native";

export function Card({ className = "", ...props }: ViewProps & { className?: string }) {
  return <View className={`border border-slate-200 dark:border-slate-800 rounded-xl p-4 ${className}`} {...props} />;
}
