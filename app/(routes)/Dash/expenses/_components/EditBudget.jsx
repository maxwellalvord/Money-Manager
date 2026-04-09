"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

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
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Budgets } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({ budgetInfo, refreshData }) {
const [emojiIcon, setEmojiIcon] = useState("😀");
const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

const [name, setName] = useState();
const [amount, setAmount] = useState();

const {user} = useUser();

useEffect(() => {
  if (budgetInfo) {
    setName(budgetInfo.name ?? "");
    setAmount(budgetInfo.amount ?? "");
    setEmojiIcon(budgetInfo.icon ?? "😀");
  }
}, [budgetInfo]);

const onUpdateBudget = async () => {
  const res = await db.update(Budgets).set({
    name,
    amount: Number(amount),
    icon: emojiIcon
  }).where(eq(Budgets.id, budgetInfo.id)).returning();

  if (res) {
    refreshData();
    toast.success("Budget edited successfully!");
  }
}


  return (
    <div>
        
        <Dialog>
          <DialogTrigger asChild className='w-full'> 
            <Button className='flex gap-2'> <PenBox/> Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Budget</DialogTitle>
              <DialogDescription asChild>
                <div className='mt-5'>
                  <Button variant='outline'
                    size='lg'
                    className='text-lg'
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                    {emojiIcon}
                  </Button>
                  <div className='absolute z-20'>
                    <EmojiPicker 
                    open={openEmojiPicker}
                    onEmojiClick={(e)=>{
                       setEmojiIcon(e.emoji)
                       setOpenEmojiPicker(false)
                      }}
                    />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                    <Input placeholder='e.g. Groceries'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                    <Input placeholder='e.g. $500' type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                 
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                 <Button
                    disabled={!(name && amount)}
                    onClick={()=>onUpdateBudget()}
                    className='mt-5 w-full'> Edit Budget
                  </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default EditBudget