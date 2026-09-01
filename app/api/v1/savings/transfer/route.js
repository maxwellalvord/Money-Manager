import { handle } from "@/app/api/v1/_lib/respond";
import { transferFromSavings } from "@/app/actions/savings";

export const POST = handle(async (request) => {
  const body = await request.json();
  await transferFromSavings(body);
  return { ok: true };
});
