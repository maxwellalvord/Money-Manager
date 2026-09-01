import type { UserSettings } from "@/lib/types";

// Mirrors app/(routes)/Dash/layout.jsx's periodHasEnded on the web app.
export function periodHasEnded(settings: UserSettings | null | undefined): boolean {
  if (!settings?.budgetEndDay) return false;
  const today = new Date();
  const todayDate = today.getDate();
  const endDay = settings.budgetEndDay;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const clampedEndDay = Math.min(endDay, daysInMonth);

  if (todayDate <= clampedEndDay) return false;

  const periodEndDate = new Date(today.getFullYear(), today.getMonth(), clampedEndDay);
  const periodStart = settings.budgetPeriodStart ? new Date(settings.budgetPeriodStart) : null;
  return !!periodStart && periodStart <= periodEndDate;
}
