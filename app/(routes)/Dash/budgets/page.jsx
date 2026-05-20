import React from 'react'
import BudgetList from './_components/BudgetList'

function Budget() {
  return (
    <div className='p-4 sm:p-10'>
      <div className='mb-1'>
        <p className='text-xs font-bold uppercase tracking-[0.18em] text-indigo-500 mb-1'>Overview</p>
        <h2 className='font-extrabold text-3xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'>
          My Budgets
        </h2>
      </div>
      <BudgetList />
    </div>
  )
}

export default Budget