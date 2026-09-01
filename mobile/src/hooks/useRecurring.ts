import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { RecurringExpense } from "@/lib/types";

export function useRecurringByBudget(budgetId: number | string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: ["recurring", String(budgetId)],
    queryFn: () => api.get<RecurringExpense[]>(`/api/v1/recurring?budgetId=${budgetId}`),
    enabled: budgetId !== undefined,
  });
}

export function useAddRecurring(budgetId: number | string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; amount: number; dueDay: number }) =>
      api.post("/api/v1/recurring", { ...body, budgetId: Number(budgetId) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring", String(budgetId)] }),
  });
}

export function useDeleteRecurring(budgetId: number | string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.delete(`/api/v1/recurring/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring", String(budgetId)] }),
  });
}

export function useApplyDueRecurring() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/api/v1/recurring/apply-due"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
