import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

function AddExpense() {

    const [name, setName] = useState();
    const [amount, setAmount] = useState();
  return (
    <div className= 'border p-5 rounded-lg'>
        <h2 className= 'font-bold text-lg'>Add Expense</h2>
        <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Name</h2>
            <Input placeholder='e.g. Record Store'
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Amount</h2>
            <Input placeholder='e.g. 65'
            onChange={(e) => setAmount(e.target.value)}
            />
        </div>
        <Button disabled={!(name&&amount)} className="mt-3 w-full">Add New Expense</Button>
    </div>
  )
}

export default AddExpense