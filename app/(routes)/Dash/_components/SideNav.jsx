

'use client'

import Image from 'next/image'
import { LayoutDashboard, HandCoins, BanknoteArrowDown, HeartHandshake } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

function SideNav() {
    const menuList = [
        {
            id:1, 
            name:'Dashboard',
            icon: LayoutDashboard,
            path:"/Dash"
        },
        {
            id:2, 
            name:'Budgets',
            icon: HandCoins,
            path:"/Dash/budgets"
        },
        {
            id:3, 
            name:'Expenses',
            icon: BanknoteArrowDown,
            path:"/Dash/expenses"
        },
        {
            id:4, 
            name:'Donate',
            icon: HeartHandshake,
            path:"/Dash/donate"
        }
    ]
    const path = usePathname();

    useEffect(() => {
        console.log(path)
    }, [path])
    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src='/logo.svg'
                alt='logo'
                width={160}
                height={100}
            />
            <div className='mt-5'>
                {menuList.map((menu, index) => {
                    const Icon = menu.icon;
                    return (
                        <Link key={menu.id} href={menu.path}>
                        <h2 key={menu.id} className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 rounded-md hover:text-primary hover:bg-blue-100
                            ${path==menu.path && "bg-blue-100 text-primary"}
                            `}>
                            <Icon />
                            {menu.name}
                        </h2>
                        </Link>
                    )
                })}
            </div>
                <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
                    <UserButton />
                    Profile
                </div>
        </div>
    )
}

export default SideNav  