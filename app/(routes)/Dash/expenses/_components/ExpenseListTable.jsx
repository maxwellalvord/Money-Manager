import { Trash } from 'lucide-react'
import React from 'react'

function ExpenseListTable({expensesList}) {
  return (
    <div className='mt-2'>
        <div className='grid grid-cols-4 bg-slate-200 p-2'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Amount</h2>
            <h2 className='font-bold'>Date</h2>
            <h2 className='font-bold'>Action</h2>
        </div>
        {expensesList.map((expenses, i) => {
            // must save date in const to convert from iso format, Will use "moment" library in future for better date handling. 
            const date = expenses.createdAt
                ? new Date(expenses.createdAt)
                : null;
            return (
              <div key={expenses.id || i} className='grid grid-cols-4 bg-slate-200 p-2'>
                <h2>{expenses.name}</h2>
                <h2>${expenses.amount}</h2>
                <h2>{date ? date.toDateString() : '-'}</h2>
                <h2><Trash className='text-red-600'/></h2>
              </div>
            )
        })}
    </div>
  )
}

export default ExpenseListTable