"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSettings, updateSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import { PenBox } from 'lucide-react'

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

function EditMonthlyBudget() {
  const [amount, setAmount] = useState("");
  const [endDay, setEndDay] = useState(null);

  const onOpen = async () => {
    try {
      const result = await getSettings();
      if (result.length > 0) {
        setAmount(String(result[0].monthlyBudget));
        setEndDay(result[0].budgetEndDay ?? null);
      }
    } catch {
      toast.error("Failed to load settings.");
    }
  };

  const onSave = async () => {
    const parsed = Number(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await updateSettings({
        monthlyBudget: amount,
        ...(endDay && { budgetEndDay: endDay }),
      });
      toast.success("Monthly budget updated!");
    } catch {
      toast.error("Failed to update budget.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2" onClick={onOpen}>
          <PenBox className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Monthly Budget</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Monthly Budget</DialogTitle>
          <DialogDescription>
            Update your total monthly budget and the day your budget period ends each month.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div>
            <h2 className="font-medium mb-1 text-sm">Total Monthly Budget ($)</h2>
            <Input
              placeholder="e.g. 3000"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <h2 className="font-medium mb-1 text-sm">Budget End Day</h2>
            <DayPicker selected={endDay} onSelect={setEndDay} />
            {endDay && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Budget period ends on day <span className="font-bold text-foreground">{endDay}</span> each month.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!amount || Number(amount) <= 0}
              onClick={onSave}
              className="mt-4 w-full"
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditMonthlyBudget
