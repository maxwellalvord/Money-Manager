import { handle } from "@/app/api/v1/_lib/respond";
import { applyDueRecurring } from "@/app/actions/recurring";

export const POST = handle(async () => {
  await applyDueRecurring();
  return { ok: true };
});
