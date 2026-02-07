"use client"
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashvboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

function Dashlayout({children}) {

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    user&&checkUserBudgets();
  }, [user])

  const checkUserBudgets = async() => {
    const result = await db.select()
    .from(Budgets)
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))

    console.log(result);
    if(result.length === 0){
      router.replace('/Dash/budgets');
    }
  }
  return (
    <div >
        <div className='fixed md:w-64 hidden md:block'>
            <SideNav />
        </div>
        <div className='md:ml-64 '>
            <DashvboardHeader />
            {children}
        </div>
        </div>
  )
}

export default Dashlayout