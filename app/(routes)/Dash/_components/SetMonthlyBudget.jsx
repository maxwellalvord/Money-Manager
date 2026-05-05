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
import { createSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { PiggyBank, ChevronRight } from 'lucide-react'

function DayPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-7 gap-1 mt-2">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onSelect(day)}
          className={`rounded p-2 text-sm font-medium transition-colors
            ${selected === day
              ? 'bg-primary text-white'
              : 'hover:bg-muted text-foreground'
            }`}
        >
          {day}
        </button>
      ))}
    </div>
  )
}

function SetMonthlyBudget({ open, onSet }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [endDay, setEndDay] = useState(null);

  const onSave = async () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || !endDay) return;

    try {
      const result = await createSettings({
        monthlyBudget: amount,
        budgetEndDay: endDay,
        budgetPeriodStart: new Date().toISOString(),
      });
      if (result) {
        toast.success("Monthly budget set!");
        onSet(parsed);
      }
    } catch {
      toast.error("Failed to save budget. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <PiggyBank className="bg-primary p-2 h-10 w-10 rounded-full text-white flex-shrink-0" />
            <DialogTitle className="text-xl">
              {step === 1 ? 'Set Your Monthly Budget' : 'Choose Your Budget End Day'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {step === 1
              ? "Enter your total monthly budget. Individual budgets come out of this amount."
              : "Pick the day of the month your budget period ends. The day after, you'll be prompted to start fresh."
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="mt-2">
              <h2 className="font-medium mb-1 text-sm">Total Monthly Budget ($)</h2>
              <Input
                placeholder="e.g. 3000"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && Number(amount) > 0 && setStep(2)}
              />
            </div>
            <Button
              disabled={!amount || Number(amount) <= 0}
              onClick={() => setStep(2)}
              className="mt-4 w-full flex gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-muted-foreground mt-2">
              Select the day your budget ends each month:
            </p>
            <DayPicker selected={endDay} onSelect={setEndDay} />
            {endDay && (
              <p className="text-sm text-center text-muted-foreground mt-2">
                Budget period ends on day <span className="font-bold text-foreground">{endDay}</span> each month.
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">Back</Button>
              <Button disabled={!endDay} onClick={onSave} className="w-full">
                Set Budget
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SetMonthlyBudget
