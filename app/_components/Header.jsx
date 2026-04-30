"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'


function Header() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className='p-5 flex justify-between items-center'>
      <Image src={'./logo.svg'} alt='logo' width={160} height={100} />

      <p className="text-3xl font-extrabold text-black tracking-tight uppercase leading-none flex items-end gap-1">
        <span className="font-extrabold">Money</span>
        <span className="font-light tracking-widest text-black/80">Manager</span>
      </p>

      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/Dash">
              Start Tracking!
            </Link>
          </Button>
          <UserButton />
        </div>
      ) : (
        <Button asChild>
          <Link href="/sign-in">
            Start Tracking!
          </Link>
        </Button>
      )}
    </div>
  )
}

export default Header