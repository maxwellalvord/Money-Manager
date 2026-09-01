import { handle } from "@/app/api/v1/_lib/respond";
import { getOrCreateSavingsBudget, createSavingsBudget } from "@/app/actions/savings";

export const GET = handle(async () => {
  return getOrCreateSavingsBudget();
});

export const POST = handle(async (request) => {
  const body = await request.json();
  return createSavingsBudget(body);
});
