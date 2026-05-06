"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'
import { getBudgetsWithSpend } from '@/app/actions/budgets'
import { getSettings } from '@/app/actions/settings'

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user])

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgets, settings] = await Promise.all([
        getBudgetsWithSpend(),
        getSettings(),
      ]);
      setBudgetList(budgets);
      if (settings.length > 0) {
        setMonthlyBudget(Number(settings[0].monthlyBudget));
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalAllocated = budgetList.filter(b => !b.isSavings).reduce((sum, b) => sum + Number(b.amount), 0);
  const remainingToAllocate = monthlyBudget - totalAllocated;

  return (
    <div className='mt-7'>
      {monthlyBudget > 0 && (
        <div className='mb-5 p-4 rounded-lg border bg-card flex flex-wrap gap-4 items-center justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Monthly Budget</p>
            <p className='font-bold text-lg'>${monthlyBudget.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Allocated</p>
            <p className='font-bold text-lg'>${totalAllocated.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Remaining to Allocate</p>
            <p className={`font-bold text-lg ${remainingToAllocate < 0 ? 'text-red-500' : 'text-green-600'}`}>
              ${remainingToAllocate.toLocaleString()}
            </p>
          </div>
          <div className='w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden'>
            <div
              className={`h-2 rounded-full transition-all ${totalAllocated > monthlyBudget ? 'bg-red-500' : 'bg-primary'}`}
              style={{ width: `${Math.min((totalAllocated / monthlyBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <CreateBudget
          refreshData={fetchData}
          monthlyBudget={monthlyBudget}
          totalAllocated={totalAllocated}
        />
        {loading
          ? [1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className='bg-slate-100 p-5 rounded-lg animate-pulse h-[145px]' />
            ))
          : budgetList.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))
        }
      </div>
    </div>
  )
}

export default BudgetList
