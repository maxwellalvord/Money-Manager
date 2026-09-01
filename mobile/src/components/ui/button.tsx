import { ActivityIndicator, Pressable, Text } from "react-native";

type Variant = "primary" | "outline" | "destructive" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600",
  outline: "border border-slate-300 dark:border-slate-700",
  destructive: "bg-red-600",
  ghost: "",
};

const textClasses: Record<Variant, string> = {
  primary: "text-white font-semibold",
  outline: "text-slate-900 dark:text-white font-medium",
  destructive: "text-white font-semibold",
  ghost: "text-blue-600 font-medium",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-lg py-3 items-center ${variantClasses[variant]} ${disabled || loading ? "opacity-60" : ""}`}
    >
      {loading ? <ActivityIndicator color={variant === "primary" || variant === "destructive" ? "white" : "gray"} /> : <Text className={textClasses[variant]}>{title}</Text>}
    </Pressable>
  );
}
