'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, ChevronDown, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { addExpense } from '@/app/actions/expenses'

function QuickAddExpense({ budgetList, refreshData }) {
  const [selectedBudgetId, setSelectedBudgetId] = useState('')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [overrideBudget, setOverrideBudget] = useState(false)
  const [loading, setLoading] = useState(false)

  const spendingBudgets = budgetList.filter(b => !b.isSavings)
  const selectedBudget = spendingBudgets.find(b => String(b.id) === selectedBudgetId)
  const remaining = selectedBudget
    ? Number(selectedBudget.amount) - Number(selectedBudget.totalSpend || 0)
    : undefined

  const numericAmount = Number(amount)
  const isValidAmount = amount && !isNaN(numericAmount) && numericAmount > 0
  const amountWithinBudget = remaining === undefined || numericAmount <= remaining
  const showOverrideOption = remaining !== undefined && amount && !amountWithinBudget
  const isDisabled = !(selectedBudgetId && name && isValidAmount && (amountWithinBudget || overrideBudget))

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
    setOverrideBudget(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await addExpense({
        name,
        amount,
        budgetId: selectedBudgetId,
        createdAt: new Date().toISOString(),
        isOverride: overrideBudget ? 1 : 0,
      })
      if (res) {
        setName('')
        setAmount('')
        setOverrideBudget(false)
        refreshData()
        toast(overrideBudget ? 'Expense Added (Budget Override)' : 'Expense Added Successfully')
      }
    } catch {
      toast.error('Failed to add expense.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-5">
      <h3 className="font-bold text-lg mb-4">Quick Add Expense</h3>
      <div className="flex flex-col sm:flex-row gap-3 items-start">

        <div className="relative w-full sm:w-56 flex-shrink-0">
          <select
            value={selectedBudgetId}
            onChange={(e) => { setSelectedBudgetId(e.target.value); setOverrideBudget(false) }}
            className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
          >
            <option value="">Select a budget...</option>
            {spendingBudgets.map(b => (
              <option key={b.id} value={String(b.id)}>
                {b.icon} {b.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Input
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!selectedBudgetId}
          className="w-full sm:flex-1"
        />

        <div className="w-full sm:w-36 flex-shrink-0">
          <Input
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
            disabled={!selectedBudgetId}
          />
        </div>

        <Button
          disabled={isDisabled || loading}
          onClick={handleSubmit}
          className="w-full sm:w-auto flex-shrink-0"
        >
          {loading ? <Loader className="animate-spin h-4 w-4" /> : 'Add'}
        </Button>
      </div>

      {selectedBudget && (
        <p className="mt-2 text-xs text-muted-foreground">
          {selectedBudget.icon} {selectedBudget.name} — ${Number(selectedBudget.totalSpend || 0).toFixed(2)} spent of ${Number(selectedBudget.amount).toFixed(2)} (${remaining.toFixed(2)} remaining)
        </p>
      )}

      {showOverrideOption && (
        <div className="mt-3 space-y-1">
          <p className="text-sm text-red-500">
            Amount exceeds remaining budget (${remaining.toFixed(2)}).
          </p>
          <label className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${overrideBudget ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-border text-muted-foreground hover:border-amber-300'}`}>
            <input
              type="checkbox"
              checked={overrideBudget}
              onChange={(e) => setOverrideBudget(e.target.checked)}
              className="accent-amber-500"
            />
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            Override budget limit
          </label>
        </div>
      )}
    </div>
  )
}

export default QuickAddExpense
