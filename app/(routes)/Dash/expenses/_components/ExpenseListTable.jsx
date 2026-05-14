import { Trash } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { deleteExpense } from '@/app/actions/expenses'
import DeleteExpenseDialog from './DeleteExpenseDialog'

function ExpenseListTable({ expensesList, refreshData }) {
    const [pendingDelete, setPendingDelete] = useState(null)

    const handleDeleteClick = (expense) => {
        setPendingDelete(expense)
    }

    const handleConfirm = async () => {
        try {
            const res = await deleteExpense(pendingDelete.id);
            if (res) {
                toast('Expense Deleted Successfully!');
                refreshData();
            }
        } catch {
            toast.error('Failed to delete expense.');
        } finally {
            setPendingDelete(null)
        }
    }

    const handleCancel = () => {
        setPendingDelete(null)
    }

    return (
        <div className='mt-2'>
            <h2 className='font-bold text-lg bg-sidebar-accent'>Latest Expenses</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 bg-output p-2 mt-3'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold hidden sm:block'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>
            {expensesList.map((expenses, i) => {
                const date = expenses.createdAt ? new Date(expenses.createdAt) : null;
                return (
                    <div key={expenses.id || i} className='grid grid-cols-3 sm:grid-cols-4 bg-output p-2'>
                        <h2 className='truncate pr-2'>{expenses.name}</h2>
                        <h2>${expenses.amount}</h2>
                        <h2 className='hidden sm:block'>{date ? date.toDateString() : '-'}</h2>
                        <h2>
                            <Trash className='text-red-600 cursor-pointer ml-2.75'
                                onClick={() => handleDeleteClick(expenses)}
                            />
                        </h2>
                    </div>
                )
            })}

            <DeleteExpenseDialog
                open={!!pendingDelete}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default ExpenseListTable
