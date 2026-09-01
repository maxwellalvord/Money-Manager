import { handle } from "@/app/api/v1/_lib/respond";
import { updateSavingsGoal } from "@/app/actions/budgets";

export const PATCH = handle(async (request, { params }) => {
  const { id } = await params;
  const { goal } = await request.json();
  await updateSavingsGoal(id, goal);
  return { ok: true };
});
