"use client"
import Image from 'next/image'
import React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm">
          <Image
            src="/logo.svg"
            alt="logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Money<span className="font-light text-muted-foreground">Manager</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/how-to-use"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          How To Use
        </Link>
        {isSignedIn ? (
          <>
            <Link
              href="/Dash"
              className="group inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm shadow-indigo-600/30"
            >
              Dashboard
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <UserButton />
          </>
        ) : (
          <Link
            href="/sign-in"
            className="group inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm shadow-indigo-600/30"
          >
            Start Tracking
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
