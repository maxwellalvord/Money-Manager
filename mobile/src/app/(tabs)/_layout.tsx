import { NativeTabs } from "expo-router/unstable-native-tabs";

import { BudgetPeriodEndPromptModal } from "@/components/budget-period-end-prompt-modal";
import { SetMonthlyBudgetModal } from "@/components/set-monthly-budget-modal";
import { useSettings } from "@/hooks/useSettings";
import { periodHasEnded } from "@/lib/period";

export default function TabsLayout() {
  const settingsQuery = useSettings();
  const settings = settingsQuery.data?.[0] ?? null;

  const needsSetup = settingsQuery.isSuccess && settingsQuery.data.length === 0;
  const periodEnded = !needsSetup && periodHasEnded(settings);

  return (
    <>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="budgets">
          <NativeTabs.Trigger.Label>Budgets</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="chart.pie.fill" md="pie_chart" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="expenses">
          <NativeTabs.Trigger.Label>Expenses</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="list.bullet.rectangle.fill" md="receipt_long" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
        </NativeTabs.Trigger>
      </NativeTabs>

      <SetMonthlyBudgetModal visible={needsSetup} onDone={() => settingsQuery.refetch()} />
      <BudgetPeriodEndPromptModal visible={periodEnded} settings={settings} onDismiss={() => settingsQuery.refetch()} />
    </>
  );
}
