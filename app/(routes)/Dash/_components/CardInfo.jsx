import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList, monthlyBudget, loading }) {

    const [totalAllocated, setTotalAllocated] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);

    useEffect(() => {
        budgetList && CalcCardInfo()
    }, [budgetList])

    const CalcCardInfo = () => {
        let allocated = 0;
        let spend = 0;
        budgetList.forEach((i) => {
            allocated = allocated + Number(i.amount);
            spend = spend + i.totalSpend;
        })
        setTotalAllocated(allocated);
        setTotalSpend(spend);
    }

    const remainingMonthly = monthlyBudget - totalSpend;

    return (
        <div>
            {!loading ?
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm font-bold'>Monthly Budget</h2>
                            <h2 className='font-bold text-2xl'>${monthlyBudget.toLocaleString()}</h2>
                            <p className='text-xs text-muted-foreground mt-1'>
                                ${totalAllocated.toLocaleString()} allocated
                            </p>
                        </div>
                        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white flex-shrink-0' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm font-bold'>Total Spent</h2>
                            <h2 className='font-bold text-2xl'>${totalSpend.toLocaleString()}</h2>
                        </div>
                        <ReceiptText className='bg-primary p-3 h-12 w-12 rounded-full text-white flex-shrink-0' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm font-bold'>Remaining This Month</h2>
                            <h2 className={`font-bold text-2xl ${remainingMonthly < 0 ? 'text-red-500' : ''}`}>
                                ${remainingMonthly.toLocaleString()}
                            </h2>
                        </div>
                        <Wallet className={`p-3 h-12 w-12 rounded-full text-white flex-shrink-0 ${remainingMonthly < 0 ? 'bg-red-500' : 'bg-primary'}`} />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm font-bold'># of Budgets</h2>
                            <h2 className='font-bold text-2xl'>{budgetList.length}</h2>
                        </div>
                        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white flex-shrink-0' />
                    </div>
                </div>
                :
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[1, 2, 3, 4].map((item, i) => (
                        <div className='h-[120px] w-full bg-slate-200 animate-pulse rounded-lg' key={i}>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default CardInfo
