

'use client'

import Image from 'next/image'
import { LayoutDashboard, HandCoins, BanknoteArrowDown, HeartHandshake, X } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

function SideNav({ onClose }) {
    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: "/Dash"
        },
        {
            id: 2,
            name: 'Budgets',
            icon: HandCoins,
            path: "/Dash/budgets"
        },
        {
            id: 3,
            name: 'Expenses',
            icon: BanknoteArrowDown,
            path: "/Dash/expenses"
        },
        {
            id: 4,
            name: 'Donate',
            icon: HeartHandshake,
            path: "/Dash/donate"
        }
    ]
    const path = usePathname();

    return (
        <div className='h-screen p-5 border shadow-sm bg-background'>
            <div className="md:hidden flex justify-end mb-2">
                <button
                    onClick={onClose}
                    className='p-2 rounded-md hover:bg-muted transition-colors'
                    aria-label="Close navigation menu"
                >
                    <X className='h-5 w-5' />
                </button>
            </div>
            <div className="w-full flex justify-center py-4">
                <div className="w-35 h-35 flex items-center justify-center rounded-2xl bg-white overflow-hidden">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={120}
                        height={120}
                        className="object-contain"
                    />
                </div>
            </div>
            <div className='mt-5'>
                {menuList.map((menu, index) => {
                    const Icon = menu.icon;
                    return (
                        <Link key={menu.id} href={menu.path} onClick={onClose}>
                            <h2 key={menu.id} className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 rounded-md hover:text-primary hover:bg-ring
                            ${path == menu.path && "bg-muted text-primary"}
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