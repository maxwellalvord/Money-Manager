import { handle } from "@/app/api/v1/_lib/respond";
import { getNonSavingsBudgets } from "@/app/actions/savings";

export const GET = handle(async () => {
  return getNonSavingsBudgets();
});
