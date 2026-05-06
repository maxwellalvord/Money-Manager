import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {
    const isSavings = budget?.isSavings === 1

    const spent = Number(budget.totalSpend) || 0
    const total = Number(budget.amount) || 0
    const remaining = total - spent
    const progress = total > 0 ? Math.min((spent / total) * 100, 100) : 0

    return (
        <Link href={'/Dash/expenses/' + budget?.id} >
            <div className={`p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px] ${isSavings ? 'border-yellow-400 bg-yellow-50/40 dark:bg-yellow-900/10' : ''}`}>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className={`text-2xl p-3 px-4 rounded-full ${isSavings ? 'bg-yellow-100' : 'bg-slate-100'}`}>{budget?.icon}</h2>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h2 className='font-bold'>{budget.name}</h2>
                                {isSavings && (
                                    <span className='text-xs bg-yellow-400 text-yellow-900 font-semibold px-1.5 py-0.5 rounded'>SAVINGS</span>
                                )}
                            </div>
                            <h2 className='text-sm text-gray-500'>{budget.totalItem} item(s)</h2>
                        </div>
                    </div>
                    <h2 className={`font-bold text-lg ${isSavings ? 'text-yellow-600' : 'text-primary'}`}>${total.toLocaleString()}</h2>
                </div>

                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-400'>${spent.toFixed(2)} {isSavings ? 'Used' : 'Spent'}</h2>
                        <h2 className='text-xs text-slate-400'>${remaining.toFixed(2)} {isSavings ? 'Available' : 'Remaining'}</h2>
                    </div>
                    <div className='w-full bg-slate-300 dark:bg-slate-600 h-2 rounded-full'>
                        <div className={`h-2 rounded-full ${isSavings ? 'bg-yellow-400' : 'bg-primary'}`} style={{
                            width: `${progress}%`
                        }} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BudgetItem