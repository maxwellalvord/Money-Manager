import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react'
import { toast } from 'sonner';

function AddExpense({budget, budgetId, user, refreshData}) {

    // find remaining budget amount
    const remaining = budget
        ? Number(budget.amount) - Number(budget.totalSpend || 0)
        : undefined;

    const addNewExpense = async () => {
        const res = await db.insert(Expenses).values({
            name: name,
            amount: amount,
            budgetId: budgetId,
            createdBy: user.primaryEmailAddress?.emailAddress,
            createdAt: new Date().toISOString()
        }).returning({insertedId:Budgets.id});

        if(res)
        {
            if(clearOnSubmit === 1) {
                setName('');
                setAmount('');
            }
            refreshData();
            toast('Expense Added Successfully')
        }
    }
    
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [clearOnSubmit, setClearOnSubmit] = useState(0);

    // budget to expense comparision to see if we can submit new expense
    const numericAmount = Number(amount);
    const isValidAmount = amount && !isNaN(numericAmount) && numericAmount > 0;
    const amountWithinBudget = remaining === undefined || numericAmount <= remaining;
    const isDisabled = !(name && isValidAmount && amountWithinBudget);

  return (
    <div className= 'border p-5 rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
            <h2 className= 'font-bold text-lg'>Add Expense</h2>
            <Button variant='outline' onClick={() => setClearOnSubmit(clearOnSubmit ? 0 : 1)}>{clearOnSubmit ? 'Clear contents on submit: Enabled' : 'Clear contents on submit: Disabled'}</Button>
        </div>
        <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Name</h2>
            <Input placeholder='e.g. Record Store'
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Amount</h2>
            <Input placeholder='e.g. 65'
            value={amount || ''}
            onChange={(e) => setAmount(e.target.value)}
            />
            {remaining !== undefined && amount && !amountWithinBudget && (
                <p className="text-sm text-red-500 mt-1">
                  Amount exceeds remaining budget (${remaining}).
                </p>
            )}
        </div>
        <Button disabled={isDisabled} onClick={()=>addNewExpense()} className="mt-3 w-full">Add New Expense</Button>
    </div>
  )
}

export default AddExpense