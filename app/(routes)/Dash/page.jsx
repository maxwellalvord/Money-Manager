"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo'
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BarChartDash from './_components/BarChartDash';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

function Dash() {

 
  
  const [budgetList, setBudgetList] = useState([]);
  const {user} = useUser();
  const [expensesList, setExpensesList] = useState([]);
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
    getAllExpenses();
  }

  const getAllExpenses=async()=>{
    const res = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    }).from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.createdAt));

    setExpensesList(res);
  }

  return (
    <div className='p-8'>
      <div className=''>
        <h2 className='font-bold text-3xl'>ADD CUSTOM HALVE OVAL STYLE HERE Welcome, {user?.firstName || "loading user"}!</h2>
        <p className='text-gray-500'>Check down below for a quick breakdown of your budgets.</p>
      </div>

      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-7 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDash 
          budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={()=>getBudgetList()}
          />
        </div>
        <div className='grid gap-4'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, i)=>(
            <BudgetItem budget={budget} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dash