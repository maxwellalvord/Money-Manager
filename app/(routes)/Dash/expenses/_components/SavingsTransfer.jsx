"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader, ArrowRightLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getNonSavingsBudgets, transferFromSavings } from '@/app/actions/savings'

function SavingsTransfer({ savingsBudgetId, savingsRemaining, refreshData }) {
  const [budgets, setBudgets] = useState([])
  const [selectedBudgetId, setSelectedBudgetId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getNonSavingsBudgets().then(setBudgets).catch(console.error)
  }, [])

  const selectedBudget = budgets.find(b => b.id === Number(selectedBudgetId))
  const numAmount = Number(amount)
  const exceedsBalance = amount && numAmount > savingsRemaining
  const isValid = selectedBudgetId && numAmount > 0 && !exceedsBalance

  const onTransfer = async () => {
    if (!isValid) return
    setLoading(true)
    try {
      await transferFromSavings({
        savingsBudgetId,
        targetBudgetId: Number(selectedBudgetId),
        amount: numAmount,
        targetBudgetName: selectedBudget.name,
      })
      toast.success(`$${numAmount.toFixed(2)} transferred to ${selectedBudget.name}!`)
      setAmount('')
      setSelectedBudgetId('')
      refreshData()
    } catch {
      toast.error('Transfer failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='border p-5 rounded-lg'>
      <div className='flex items-center gap-2 mb-1'>
        <ArrowRightLeft className='h-5 w-5 text-primary' />
        <h2 className='font-bold text-lg'>Transfer to Budget</h2>
      </div>
      <p className='text-sm text-muted-foreground mb-4'>
        Available: <span className='font-semibold text-foreground'>${savingsRemaining.toFixed(2)}</span>
      </p>

      <div className='mt-2'>
        <h2 className='text-foreground font-medium my-1'>Select Budget</h2>
        <select
          className='w-full border rounded-md px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring'
          value={selectedBudgetId}
          onChange={e => setSelectedBudgetId(e.target.value)}
        >
          <option value=''>-- Choose a budget --</option>
          {budgets.map(b => (
            <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
          ))}
        </select>
      </div>

      <div className='mt-2'>
        <h2 className='text-foreground font-medium my-1'>Amount</h2>
        <Input
          placeholder='e.g. 100'
          type='number'
          min='1'
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        {exceedsBalance && (
          <p className='text-sm text-red-500 mt-1'>
            Exceeds available savings (${savingsRemaining.toFixed(2)})
          </p>
        )}
      </div>

      <Button
        disabled={!isValid || loading}
        onClick={onTransfer}
        className='mt-3 w-full'
      >
        {loading ? <Loader className='animate-spin' /> : 'Transfer to Budget'}
      </Button>
    </div>
  )
}

export default SavingsTransfer
