import { handle } from "@/app/api/v1/_lib/respond";
import { getLatestStatement } from "@/app/actions/statements";

export const GET = handle(async () => {
  return getLatestStatement();
});
