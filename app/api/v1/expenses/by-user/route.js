import { handle } from "@/app/api/v1/_lib/respond";
import { getExpensesByUser } from "@/app/actions/expenses";

export const GET = handle(async () => {
  return getExpensesByUser();
});
