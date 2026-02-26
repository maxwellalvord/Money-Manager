"use client"
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import React, { use, useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from '../_components/AddExpense'
import ExpenseListTable from '../_components/ExpenseListTable'

function ExpensesScreen({params}) { 
  const {id} = use(params)
  const {user} = useUser();
  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  useEffect(()=>{
    user && getBudgetInfo();
  },[user])
  const getBudgetInfo = async() => {
    const result = await db.select({
          ...getTableColumns(Budgets),
          totalSpend: sql `sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql `count(${Expenses.id})`.mapWith(Number),
        }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, id))
        .groupBy(Budgets.id)
        
        setbudgetInfo(result[0]);
        getExpensesList();

    
  }

  const getExpensesList = async() => {
    const res = await db.select().from(Expenses).where(eq(Expenses.budgetId, id)).orderBy(desc(Expenses.id));

    setExpensesList(res);

    
  }
  return (
    <div className='p-8'>
      <h2 className='text-3xl font-bold'>My Expenses</h2>
      <div className=' grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
        {budgetInfo? <BudgetItem
        budget={budgetInfo}
        />:
        <div className = 'h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
        </div>
        }
        <AddExpense
          budget={budgetInfo}
          budgetId={id}
          user={user}
          refreshData={()=>getBudgetInfo()}
        />
      </div>
      <div className='mt-8'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <ExpenseListTable expensesList={expensesList} />
      </div>
    </div>
  )
}

export default ExpensesScreen