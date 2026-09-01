import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { Budget } from "@/lib/types";

export function useBudgets() {
  const api = useApi();
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.get<Budget[]>("/api/v1/budgets"),
  });
}

export function useBudget(id: number | string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: ["budgets", String(id)],
    queryFn: () => api.get<Budget>(`/api/v1/budgets/${id}`),
    enabled: id !== undefined,
  });
}

export function useCreateBudget() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; amount: number; icon?: string; dueDate?: string; isOverride?: number }) =>
      api.post<{ insertedId: number }[]>("/api/v1/budgets", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}

export function useUpdateBudget(id: number | string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; amount: number; icon?: string; dueDate?: string }) =>
      api.patch(`/api/v1/budgets/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budgets", String(id)] });
    },
  });
}

export function useDeleteBudget() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.delete(`/api/v1/budgets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}

export function useUpdateSavingsGoal(id: number | string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goal: number | null) => api.patch(`/api/v1/budgets/${id}/savings-goal`, { goal }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budgets", String(id)] });
    },
  });
}

export function useDeleteAllNonSavingsBudgets() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/api/v1/budgets"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}
