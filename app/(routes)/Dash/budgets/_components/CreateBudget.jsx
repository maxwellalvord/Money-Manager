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
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import { createBudget } from '@/app/actions/budgets'
import { toast } from 'sonner'

function CreateBudget({ refreshData, monthlyBudget, totalAllocated }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [overrideBudget, setOverrideBudget] = useState(false);

  const remainingToAllocate = monthlyBudget - totalAllocated;
  const enteredAmount = Number(amount);
  const exceedsRemaining = monthlyBudget > 0 && enteredAmount > remainingToAllocate;
  const isDisabled = !(name && amount) || (exceedsRemaining && !overrideBudget);

  const onCreateBudget = async () => {
    try {
      const result = await createBudget({
        name,
        amount,
        icon: emojiIcon,
        dueDate,
        isOverride: overrideBudget ? 1 : 0,
      });
      if (result) {
        setName('');
        setAmount('');
        setDueDate('');
        setEmojiIcon('😀');
        setOverrideBudget(false);
        refreshData();
        toast(overrideBudget ? 'Budget Created (Allocation Override)' : 'New Budget Created!');
      }
    } catch {
      toast.error('Failed to create budget.');
    }
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setOverrideBudget(false);
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className='w-full'>
          <div className='bg-background p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription asChild>
              <div className='mt-5'>
                {monthlyBudget > 0 && (
                  <div className='mb-4 p-3 bg-muted rounded-lg text-sm space-y-1'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Monthly Budget</span>
                      <span className='font-semibold'>${monthlyBudget.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Already Allocated</span>
                      <span className='font-semibold'>${totalAllocated.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between border-t pt-1'>
                      <span className='text-muted-foreground'>Available to Allocate</span>
                      <span className={`font-bold ${remainingToAllocate <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                        ${remainingToAllocate.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                <Button variant='outline' size='lg' className='text-lg'
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className='absolute z-20'>
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => { setEmojiIcon(e.emoji); setOpenEmojiPicker(false); }}
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='text-foreground font-medium my-1'>Budget Name</h2>
                  <Input placeholder='e.g. Groceries' value={name}
                    onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='mt-2'>
                  <h2 className='text-foreground font-medium my-1'>Budget Amount</h2>
                  <Input placeholder='e.g. 500' type='number' value={amount}
                    onChange={handleAmountChange} />
                  {exceedsRemaining && (
                    <div className='mt-2 space-y-2'>
                      <p className='text-red-500 text-xs'>
                        Exceeds your remaining monthly budget of ${remainingToAllocate.toLocaleString()}
                      </p>
                      <label className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${overrideBudget ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-border text-muted-foreground hover:border-amber-300'}`}>
                        <input
                          type="checkbox"
                          checked={overrideBudget}
                          onChange={(e) => setOverrideBudget(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        Override allocation limit
                      </label>
                    </div>
                  )}
                </div>
                <div className='mt-2'>
                  <h2 className='text-foreground font-medium my-1'>Due Date <span className='text-muted-foreground font-normal'>(optional)</span></h2>
                  <Input type='date' value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={isDisabled}
                onClick={() => onCreateBudget()}
                className='mt-5 w-full'>
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget
