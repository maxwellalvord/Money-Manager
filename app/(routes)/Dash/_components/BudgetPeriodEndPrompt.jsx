"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { RefreshCw, ArrowRight } from 'lucide-react'

function BudgetPeriodEndPrompt({ open, currentSettings, onDismiss }) {
  const [mode, setMode] = useState('choose')
  const [newAmount, setNewAmount] = useState(String(currentSettings?.monthlyBudget ?? ''))

  const resetPeriodStart = async (amount) => {
    await updateSettings({
      monthlyBudget: String(amount),
      budgetPeriodStart: new Date().toISOString(),
    })
  }

  const onContinueLastMonth = async () => {
    try {
      await resetPeriodStart(currentSettings.monthlyBudget)
      toast.success("Continuing with last month's budget!")
      onDismiss()
    } catch {
      toast.error("Failed to update budget period.")
    }
  }

  const onStartNewBudget = async () => {
    const parsed = Number(newAmount)
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    try {
      await resetPeriodStart(parsed)
      toast.success("New budget period started!")
      onDismiss()
    } catch {
      toast.error("Failed to start new budget period.")
    }
  }

  const endDay = currentSettings?.budgetEndDay
  const today = new Date()
  const month = today.toLocaleString('default', { month: 'long' })
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    .toLocaleString('default', { month: 'long' })

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <RefreshCw className="bg-orange-500 p-2 h-10 w-10 rounded-full text-white flex-shrink-0" />
            <DialogTitle className="text-xl">Budget Period Ended</DialogTitle>
          </div>
          <DialogDescription>
            Your {prevMonth} budget period ended on day {endDay}. Would you like to start a new budget or continue with last month&apos;s settings?
          </DialogDescription>
        </DialogHeader>

        {mode === 'choose' && (
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center h-auto py-4 px-4"
              onClick={onContinueLastMonth}
            >
              <div className="text-left">
                <p className="font-semibold">Continue with Last Month&apos;s Budget</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep ${Number(currentSettings?.monthlyBudget).toLocaleString()} for {month}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>

            <Button
              className="w-full flex justify-between items-center h-auto py-4 px-4"
              onClick={() => setMode('new')}
            >
              <div className="text-left">
                <p className="font-semibold">Start a New Budget</p>
                <p className="text-xs text-white/80 mt-0.5">Set a different amount for {month}</p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        )}

        {mode === 'new' && (
          <>
            <div className="mt-2">
              <h2 className="font-medium mb-1 text-sm">New Monthly Budget ($)</h2>
              <Input
                placeholder="e.g. 3000"
                type="number"
                min="1"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onStartNewBudget()}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setMode('choose')} className="w-full">Back</Button>
              <Button
                disabled={!newAmount || Number(newAmount) <= 0}
                onClick={onStartNewBudget}
                className="w-full"
              >
                Start {month}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BudgetPeriodEndPrompt
