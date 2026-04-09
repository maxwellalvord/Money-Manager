import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React from 'react'

function CardInfo({budgetList}) {


  return (
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
                <h2 className='text-sm font-bold'>Total Budget</h2>
                <h2 className='font-bold text-2xl'>$1,000</h2>
            </div>
            <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
        </div>
        <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
                <h2 className='text-sm font-bold'>Total Spent</h2>
                <h2 className='font-bold text-2xl'>$1,000</h2>
            </div>
            <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
        </div>
        <div className='p-7 border rounded-lg flex items-center justify-between'>
            <div>
                <h2 className='text-sm font-bold'># of Budgets</h2>
                <h2 className='font-bold text-2xl'>$1,000</h2>
            </div>
            <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white'/>
        </div>
    </div>
  )
}

export default CardInfo