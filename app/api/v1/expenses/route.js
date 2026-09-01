import { handle } from "@/app/api/v1/_lib/respond";
import { getAllExpenses, addExpense } from "@/app/actions/expenses";

export const GET = handle(async () => {
  return getAllExpenses();
});

export const POST = handle(async (request) => {
  const body = await request.json();
  return addExpense(body);
});
