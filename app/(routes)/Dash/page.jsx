"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo'
import BarChartDash from './_components/BarChartDash'
import BudgetItem from './budgets/_components/BudgetItem'
import ExpenseListTable from './expenses/_components/ExpenseListTable'
import BudgetCalendar from './_components/BudgetCalendar'
import { getBudgetsWithSpend } from '@/app/actions/budgets'
import { getSettings } from '@/app/actions/settings'
import { getAllExpenses } from '@/app/actions/expenses'
import MonthlyStatement from './_components/MonthlyStatement'
import { getLatestStatement } from '@/app/actions/statements'

function Dash() {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [budgetEndDay, setBudgetEndDay] = useState(null);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      loadData();
    }
  }, [isLoaded, user])

  const loadData = async () => {
    setLoading(true);
    try {
      const [budgets, settings, expenses, latestStatement] = await Promise.all([
        getBudgetsWithSpend(),
        getSettings(),
        getAllExpenses(),
        getLatestStatement(),
      ]);
      setBudgetList(budgets);
      setExpensesList(expenses);
      setStatement(latestStatement);
      if (settings.length > 0) {
        setMonthlyBudget(Number(settings[0].monthlyBudget));
        setBudgetEndDay(settings[0].budgetEndDay ?? null);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-4 sm:p-8'>
      <div className=''>
        <h2 className='font-bold text-2xl sm:text-3xl relative inline-block mb-2'>
          <span className='relative z-10'>Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "Budgeter"}!</span>
          <div className='absolute -left-4 sm:-left-8 -top-4 -bottom-4 -right-4 sm:-right-8 border-2 border-l-0 border-blue-200 dark:border-blue-800 rounded-r-full shadow-lg bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/50'></div>
        </h2>
        <p className='ml-4 sm:ml-8 mt-3 max-w-2xl rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm'>Check down below for a quick breakdown of your budgets.</p>
      </div>

      <CardInfo budgetList={budgetList} monthlyBudget={monthlyBudget} loading={loading} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-7 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDash budgetList={budgetList} />
          <ExpenseListTable
            expensesList={expensesList}
            refreshData={loadData}
          />
          <MonthlyStatement statement={statement} />
        </div>
        <div className='grid gap-4'>
          <BudgetCalendar budgetEndDay={budgetEndDay} budgetList={budgetList} />
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, i) => (
            <BudgetItem budget={budget} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dash
