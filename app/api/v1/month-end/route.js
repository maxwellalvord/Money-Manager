import { handle } from "@/app/api/v1/_lib/respond";
import { triggerMonthEnd } from "@/app/actions/savings";

export const POST = handle(async () => {
  return triggerMonthEnd();
});
