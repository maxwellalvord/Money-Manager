"use client"

import React, { useState, useEffect } from 'react'
import ExpenseListTable from './_components/ExpenseListTable'
import { db } from '@/utils/dbConfig'
import { Expenses as ExpensesTable } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'

function Expenses() {
  const [expensesList, setExpensesList] = useState([])
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      getExpensesList()
    }
  }, [user])

  const getExpensesList = async () => {
    const res = await db
      .select()
      .from(ExpensesTable)
      .where(eq(ExpensesTable.createdBy, user?.primaryEmailAddress?.emailAddress))

    setExpensesList(res)
  }

  return (
    <div className='mt-5 ml-5'>
      <h2 className='font-bold text-xl'>Check out your expenses below</h2>
      <ExpenseListTable expensesList={expensesList} refreshData={getExpensesList}/>
    </div>
  )
}

export default Expenses