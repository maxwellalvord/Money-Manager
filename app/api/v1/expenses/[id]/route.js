import { handle } from "@/app/api/v1/_lib/respond";
import { deleteExpense } from "@/app/actions/expenses";

export const DELETE = handle(async (request, { params }) => {
  const { id } = await params;
  return deleteExpense(id);
});
