import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { UserSettings } from "@/lib/types";

export function useSettings() {
  const api = useApi();
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get<UserSettings[]>("/api/v1/settings"),
  });
}

export function useCreateSettings() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { monthlyBudget: number; budgetEndDay?: number; budgetPeriodStart?: string; savingsGoal?: number }) =>
      api.post("/api/v1/settings", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useUpdateSettings() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<{ monthlyBudget: number; budgetEndDay: number; budgetPeriodStart: string; savingsGoal: number }>) =>
      api.patch("/api/v1/settings", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
