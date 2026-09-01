import { NextResponse } from "next/server";

// Wraps a route handler, calling an existing app/actions/* function and
// mapping thrown Errors to HTTP status codes so both web and mobile clients
// can share the same business logic without duplicating it.
export function handle(fn) {
  return async (request, context) => {
    try {
      const result = await fn(request, context);
      if (result instanceof NextResponse) return result;
      return NextResponse.json(result ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      const status = message === "Unauthorized" ? 401 : /not found/i.test(message) ? 404 : 400;
      return NextResponse.json({ error: message }, { status });
    }
  };
}
