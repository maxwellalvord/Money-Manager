"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const [budgetList, setBudgetList] = useState([]);
  const {user} = useUser();
  useEffect(()=>{
    user && getBudgetList();
  },[user]) 

// join budget and expense table to get budget list
  const getBudgetList=async()=>{
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql `sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number),
    }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id)

    .orderBy(desc(Budgets.id))

    setBudgetList(result);
    }
  
  return (
    <div className='mt-7'>
        <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <CreateBudget 
            refreshData={()=>getBudgetList()}/>
            {budgetList?.length>0? budgetList.map((budget)=>(
              <BudgetItem key={budget.id} budget = {budget}/>
            ))
          :[1,2,3,4,5].map((item, i)=>(
            <div key={i} className='bg-slate-100 p-5 rounded-lg animate-pulse h-[145px]'>
            </div>
          ))}
        </div>

    </div>
  )
}

export default BudgetList