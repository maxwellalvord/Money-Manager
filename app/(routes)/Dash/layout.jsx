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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      {mobileNavOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <div className={`fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 md:translate-x-0 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SideNav onClose={() => setMobileNavOpen(false)} />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader onMenuToggle={() => setMobileNavOpen(prev => !prev)} />
        {children}
      </div>
    </div>
  )
}

export default Dashlayout
