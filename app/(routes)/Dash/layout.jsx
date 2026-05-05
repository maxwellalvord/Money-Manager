"use client"
import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import SetMonthlyBudget from './_components/SetMonthlyBudget'
import BudgetPeriodEndPrompt from './_components/BudgetPeriodEndPrompt'
import { getSettings } from '@/app/actions/settings'
import { getBudgetsWithSpend } from '@/app/actions/budgets'

function periodHasEnded(settings) {
  if (!settings?.budgetEndDay) return false
  const today = new Date()
  const todayDate = today.getDate()
  const endDay = settings.budgetEndDay
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const clampedEndDay = Math.min(endDay, daysInMonth)

  if (todayDate <= clampedEndDay) return false

  const periodEndDate = new Date(today.getFullYear(), today.getMonth(), clampedEndDay)
  const periodStart = settings.budgetPeriodStart ? new Date(settings.budgetPeriodStart) : null
  return !periodStart || periodStart <= periodEndDate
}

function Dashlayout({ children }) {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [showPeriodEndPrompt, setShowPeriodEndPrompt] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserSettings();
    }
  }, [isLoaded, user])

  const checkUserSettings = async () => {
    try {
      const settings = await getSettings();

      if (settings.length === 0) {
        setShowBudgetSetup(true);
        return;
      }

      const s = settings[0];
      setCurrentSettings(s);

      if (periodHasEnded(s)) {
        setShowPeriodEndPrompt(true);
        return;
      }

      const budgets = await getBudgetsWithSpend();
      if (budgets.length === 0) {
        router.replace('/Dash/budgets');
      }
    } catch (err) {
      console.error('Failed to load user settings:', err);
    }
  }

  const onMonthlyBudgetSet = () => {
    setShowBudgetSetup(false);
    router.replace('/Dash/budgets');
  }

  const onPeriodEndDismiss = () => {
    setShowPeriodEndPrompt(false);
  }

  return (
    <div>
      <SetMonthlyBudget open={showBudgetSetup} onSet={onMonthlyBudgetSet} />
      <BudgetPeriodEndPrompt
        open={showPeriodEndPrompt}
        currentSettings={currentSettings}
        onDismiss={onPeriodEndDismiss}
      />
      <div className='fixed md:w-64 hidden md:block'>
        <SideNav />
      </div>
      <div className='md:ml-64 '>
        <DashboardHeader />
        {children}
      </div>
    </div>
  )
}

export default Dashlayout
