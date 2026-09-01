import { Stack } from "expo-router";

export default function BudgetsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Budgets" }} />
      <Stack.Screen name="[id]" options={{ title: "Budget" }} />
    </Stack>
  );
}
