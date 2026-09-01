import { handle } from "@/app/api/v1/_lib/respond";
import { getBudgetById, updateBudget, deleteBudgetWithExpenses } from "@/app/actions/budgets";

export const GET = handle(async (request, { params }) => {
  const { id } = await params;
  const budget = await getBudgetById(id);
  if (!budget) throw new Error("Budget not found");
  return budget;
});

export const PATCH = handle(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  return updateBudget(id, body);
});

export const DELETE = handle(async (request, { params }) => {
  const { id } = await params;
  return deleteBudgetWithExpenses(id);
});
