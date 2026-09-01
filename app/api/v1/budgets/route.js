import { handle } from "@/app/api/v1/_lib/respond";
import { getBudgetsWithSpend, createBudget, deleteAllNonSavingsBudgets } from "@/app/actions/budgets";

export const GET = handle(async () => {
  return getBudgetsWithSpend();
});

export const POST = handle(async (request) => {
  const body = await request.json();
  return createBudget(body);
});

// Bulk-clears every non-savings budget (and its expenses/recurring items) —
// used by the "start a new period" flow.
export const DELETE = handle(async () => {
  await deleteAllNonSavingsBudgets();
  return { ok: true };
});
