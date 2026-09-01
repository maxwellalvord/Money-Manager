import { handle } from "@/app/api/v1/_lib/respond";
import { getSettings, createSettings, updateSettings } from "@/app/actions/settings";

export const GET = handle(async () => {
  return getSettings();
});

export const POST = handle(async (request) => {
  const body = await request.json();
  return createSettings(body);
});

export const PATCH = handle(async (request) => {
  const body = await request.json();
  return updateSettings(body);
});
