import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react'
import { refresh } from 'next/cache';
import React from 'react'
import { toast } from 'sonner';

function ExpenseListTable({ expensesList, refreshData }) {

    const deleteExpense = async (expense) => {
        const res = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();

        if (res) {
            toast('Expense Deleted Successfully!');
            refreshData();
        }
    }
    return (
        <div className='mt-2'>
            <h2 className='font-bold text-lg bg-sidebar-accent'>Latest Expenses</h2>
            <div className='grid grid-cols-4 bg-output p-2 mt-3'>
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
                    <div key={expenses.id || i} className='grid grid-cols-4 bg-output p-2'>
                        <h2>{expenses.name}</h2>
                        <h2>${expenses.amount}</h2>
                        <h2>{date ? date.toDateString() : '-'}</h2>
                        <h2><Trash className='text-red-600 cursor-pointer ml-2.75'
                            onClick={() => deleteExpense(expenses)}
                        /></h2>
                    </div>
                )
            })}
        </div>
    )
}

export default ExpenseListTable