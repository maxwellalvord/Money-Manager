import React from 'react'
import Image from 'next/image'
import { LayoutDashboard, HandCoins, BanknoteArrowDown, HeartHandshake } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'


function SideNav() {
    const menuList = [
        {
            id:1, 
            name:'Dashboard',
            icon: LayoutDashboard
        },
        {
            id:2, 
            name:'Budgets',
            icon: HandCoins
        },
        {
            id:3, 
            name:'Expenses',
            icon: BanknoteArrowDown
        },
        {
            id:4, 
            name:'Donate',
            icon: HeartHandshake
        }
    ]
  return (
    <div className='h-screen p-5 border shadow-sm'>
        <Image src='/logo.svg'
            alt='logo'
            width={160}
            height={100}
        />
        <div className='mt-5'>
            {menuList.map((menu, index) => (
                <h2 key={menu.id} className='flex gap-2 items-center text-grey-500 font-medium p-5 rounded-md hover:text-primary hover:bg-blue-100'>
                    <menu.icon />
                    {menu.name}
                </h2>
            ))}
        </div>
            <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
                <UserButton />
                Profile
            </div>
    </div>
  )
}

export default SideNav  