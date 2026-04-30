import { UserButton } from '@clerk/nextjs'
import React from 'react'
import ThemeToggle from '@/app/_components/ThemeToggle'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border flex justify-between'>
       <p className="text-3xl font-extrabold text-foreground tracking-tight uppercase leading-none flex items-end gap-1">
        <span className="font-extrabold">Money</span>
        <span className="font-light tracking-widest text-foreground">Manager</span>
      </p>
      <div className="flex items-center gap-3">
      <ThemeToggle />
      
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader