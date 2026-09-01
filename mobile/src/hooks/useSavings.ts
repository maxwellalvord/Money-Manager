import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { Budget } from "@/lib/types";

export function useOrCreateSavingsBudget() {
  const api = useApi();
  return useQuery({
    queryKey: ["savings", "default"],
    queryFn: () => api.get<Budget>("/api/v1/savings"),
  });
}

export function useCreateSavingsBudget() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; icon?: string; savingsGoal?: number }) =>
      api.post<Budget>("/api/v1/savings", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
}

export function useNonSavingsBudgets() {
  const api = useApi();
  return useQuery({
    queryKey: ["savings", "non-savings-budgets"],
    queryFn: () => api.get<Budget[]>("/api/v1/savings/non-savings-budgets"),
  });
}

export function useTransferFromSavings(savingsBudgetId: number | string) {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { targetBudgetId: number; amount: number; targetBudgetName: string }) =>
      api.post("/api/v1/savings/transfer", { ...body, savingsBudgetId: Number(savingsBudgetId) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useTriggerMonthEnd() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ savedAmount: number; savingsBudgetId: number }>("/api/v1/month-end"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["statements"] });
    },
  });
}
