import { handle } from "@/app/api/v1/_lib/respond";
import { deleteRecurring } from "@/app/actions/recurring";

export const DELETE = handle(async (request, { params }) => {
  const { id } = await params;
  return deleteRecurring(id);
});
