import { UserButton } from '@clerk/nextjs'
import React from 'react'
import ThemeToggle from '@/app/_components/ThemeToggle'
import EditMonthlyBudget from './EditMonthlyBudget'
import { Menu } from 'lucide-react'

function DashboardHeader({ onMenuToggle }) {
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
        <EditMonthlyBudget />
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader