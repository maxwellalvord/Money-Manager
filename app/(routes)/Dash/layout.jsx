
import React from 'react'
import SideNav from './_components/SideNav'
import DashvboardHeader from './_components/DashboardHeader'

function Dashlayout({children}) {
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