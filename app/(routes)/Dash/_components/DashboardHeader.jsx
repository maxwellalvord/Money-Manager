import { UserButton } from '@clerk/nextjs'
import React from 'react'
import ThemeToggle from '@/app/_components/ThemeToggle'
import EditMonthlyBudget from './EditMonthlyBudget'
import { Menu, CalendarX } from 'lucide-react'
import { Button } from '@/components/ui/button'

function DashboardHeader({ onMenuToggle, onForceMonthEnd, hasSettings }) {
  return (
    <div className='p-4 sm:p-5 shadow-sm border flex justify-between items-center'>
      <div className="flex items-center gap-2">
        <button
          className='md:hidden p-2 rounded-md hover:bg-muted transition-colors'
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <Menu className='h-5 w-5' />
        </button>
        <p className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight uppercase leading-none flex items-end gap-1">
          <span className="font-extrabold">Money</span>
          <span className="font-light tracking-widest text-foreground">Manager</span>
        </p>
      </div>
      <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-3">
        {hasSettings && (
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-white dark:text-white dark:hover:bg-white/10"
            onClick={onForceMonthEnd}
          >
            <CalendarX className="h-4 w-4" />
            <span className="hidden sm:inline">End Month</span>
          </Button>
        )}
        <EditMonthlyBudget />
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader