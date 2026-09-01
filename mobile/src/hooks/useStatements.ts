import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { MonthlyStatement } from "@/lib/types";

export function useLatestStatement() {
  const api = useApi();
  return useQuery({
    queryKey: ["statements", "latest"],
    queryFn: () => api.get<MonthlyStatement | null>("/api/v1/statements/latest"),
  });
}
