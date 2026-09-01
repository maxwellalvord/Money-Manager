import { handle } from "@/app/api/v1/_lib/respond";
import { getRecurringByBudget, addRecurring } from "@/app/actions/recurring";

export const GET = handle(async (request) => {
  const budgetId = new URL(request.url).searchParams.get("budgetId");
  if (!budgetId) throw new Error("budgetId query param is required");
  return getRecurringByBudget(budgetId);
});

export const POST = handle(async (request) => {
  const body = await request.json();
  return addRecurring(body);
});
