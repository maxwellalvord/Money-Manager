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
import { createBudget } from '@/app/actions/budgets'
import { toast } from 'sonner'

function CreateBudget({ refreshData, monthlyBudget, totalAllocated }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const remainingToAllocate = monthlyBudget - totalAllocated;
  const enteredAmount = Number(amount);
  const exceedsRemaining = monthlyBudget > 0 && enteredAmount > remainingToAllocate;

  const onCreateBudget = async () => {
    if (exceedsRemaining) {
      toast.error(`Amount exceeds your remaining monthly budget of $${remainingToAllocate.toLocaleString()}`);
      return;
    }
    try {
      const result = await createBudget({ name, amount, icon: emojiIcon });
      if (result) {
        refreshData();
        toast('New Budget Created!');
      }
    } catch {
      toast.error('Failed to create budget.');
    }
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
                    onChange={(e) => setAmount(e.target.value)} />
                  {exceedsRemaining && (
                    <p className='text-red-500 text-xs mt-1'>
                      Exceeds your remaining monthly budget of ${remainingToAllocate.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount) || exceedsRemaining}
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
