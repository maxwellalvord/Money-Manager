import React from 'react'
import { ArrowRightLeft, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteExpense } from '@/app/actions/expenses'

function SavingsHistory({ expensesList, refreshData }) {
  const onDelete = async (expense) => {
    try {
      await deleteExpense(expense.id)
      toast('Transfer record removed.')
      refreshData()
    } catch {
      toast.error('Failed to remove record.')
    }
  }

  return (
    <div className='mt-2'>
      <h2 className='font-bold text-lg mb-3'>Transfer History</h2>

      {expensesList.length === 0 ? (
        <p className='text-sm text-muted-foreground py-4 text-center border rounded-lg'>
          No transfers yet. Use the form above to move savings into a budget.
        </p>
      ) : (
        <div className='border rounded-lg overflow-hidden'>
          <div className='grid grid-cols-[1fr_auto_auto_auto] gap-x-4 bg-muted px-4 py-2 text-sm font-bold'>
            <span>Transferred To</span>
            <span>Amount</span>
            <span className='hidden sm:block'>Date</span>
            <span></span>
          </div>

          {expensesList.map((expense) => {
            const destination = expense.name?.replace(/^Transfer\s*→\s*/, '') ?? expense.name
            const date = expense.createdAt ? new Date(expense.createdAt) : null

            return (
              <div
                key={expense.id}
                className='grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-3 items-center border-t text-sm'
              >
                <div className='flex items-center gap-2 min-w-0'>
                  <ArrowRightLeft className='h-4 w-4 text-primary flex-shrink-0' />
                  <span className='truncate font-medium'>{destination}</span>
                </div>
                <span className='font-semibold text-yellow-600'>${Number(expense.amount).toFixed(2)}</span>
                <span className='hidden sm:block text-muted-foreground'>
                  {date ? date.toLocaleDateString() : '-'}
                </span>
                <Trash
                  className='h-4 w-4 text-red-500 cursor-pointer hover:text-red-700'
                  onClick={() => onDelete(expense)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SavingsHistory
