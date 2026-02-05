import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='p-5 flex justify-between items-center border shadow-xl'>
        <Image src={'./logo.svg'} 
        alt='logo'
        width={160}
        height={100}
        />
        <Button>Start Tracking!</Button>
    </div>
  )
}

export default Header