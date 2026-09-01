import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/lib/api";
import type { Budget, Expense } from "@/lib/types";

export function useAllExpenses() {
  const api = useApi();
  return useQuery({
    queryKey: ["expenses", "all"],
    queryFn: () => api.get<Expense[]>("/api/v1/expenses"),
  });
}

export function useExpensesByUser() {
  const api = useApi();
  return useQuery({
    queryKey: ["expenses", "by-user"],
    queryFn: () => api.get<Expense[]>("/api/v1/expenses/by-user"),
  });
}

export function useBudgetSummariesForExpenses() {
  const api = useApi();
  return useQuery({
    queryKey: ["expenses", "budget-summaries"],
    queryFn: () => api.get<Budget[]>("/api/v1/expenses/budget-summaries"),
  });
}

export function useExpensesByBudget(budgetId: number | string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: ["expenses", "by-budget", String(budgetId)],
    queryFn: () => api.get<Expense[]>(`/api/v1/expenses/by-budget/${budgetId}`),
    enabled: budgetId !== undefined,
  });
}

function invalidateExpenseQueries(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["expenses"] });
  qc.invalidateQueries({ queryKey: ["budgets"] });
}

export function useAddExpense() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; amount: number; budgetId: number; createdAt: string; isOverride?: number }) =>
      api.post("/api/v1/expenses", body),
    onSuccess: () => invalidateExpenseQueries(qc),
  });
}

export function useDeleteExpense() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.delete(`/api/v1/expenses/${id}`),
    onSuccess: () => invalidateExpenseQueries(qc),
  });
}
