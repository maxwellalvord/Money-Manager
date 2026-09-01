import { handle } from "@/app/api/v1/_lib/respond";
import { getExpensesByBudget } from "@/app/actions/expenses";

export const GET = handle(async (request, { params }) => {
  const { budgetId } = await params;
  return getExpensesByBudget(budgetId);
});
