"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo'
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BarChartDash from './_components/BarChartDash';

function Dash() {

 
  
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
    <div className='p-8'>
      <div className=''>
        <h2 className='font-bold text-3xl'>ADD CUSTOM HALVE OVAL STYLE HERE Welcome, {user?.firstName || "loading user"}!</h2>
        <p className='text-gray-500'>Check down below for a quick breakdown of your budgets.</p>
      </div>

      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-7'>
        <div className='md:col-span-2'>
          <BarChartDash 
          budgetList={budgetList} />
        </div>
        <div>
          other content
        </div>
      </div>
    </div>
  )
}

export default Dash