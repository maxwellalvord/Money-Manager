import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border flex justify-between'>
       <p className="text-3xl font-extrabold text-black tracking-tight uppercase leading-none flex items-end gap-1">
        <span className="font-extrabold">Money</span>
        <span className="font-light tracking-widest text-black/80">Manager</span>
      </p>
      <div>
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader