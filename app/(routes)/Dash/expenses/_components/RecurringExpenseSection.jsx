'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader, RefreshCw, Trash, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { getRecurringByBudget, addRecurring, deleteRecurring } from '@/app/actions/recurring'

const DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 1)

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function RecurringExpenseSection({ budgetId }) {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const load = async () => {
    try {
      const data = await getRecurringByBudget(budgetId)
      setList(data)
    } catch {
      // silent
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { load() }, [budgetId])

  const handleAdd = async () => {
    const n = Number(amount)
    const d = Number(dueDay)
    if (!name.trim() || !n || n <= 0 || !d) return
    setLoading(true)
    try {
      await addRecurring({ name, amount: n, budgetId: Number(budgetId), dueDay: d })
      setName('')
      setAmount('')
      setDueDay('')
      await load()
      toast.success('Recurring expense added.')
    } catch {
      toast.error('Failed to add recurring expense.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteRecurring(id)
      await load()
      toast('Recurring expense removed.')
    } catch {
      toast.error('Failed to remove.')
    }
  }

  const isValid = name.trim() && Number(amount) > 0 && Number(dueDay) >= 1

  return (
    <div className='border rounded-lg p-5'>
      <div className='flex items-center gap-2 mb-4'>
        <RefreshCw className='h-5 w-5 text-primary' />
        <h2 className='font-bold text-lg'>Recurring Expenses</h2>
      </div>

      {fetching ? (
        <div className='space-y-2'>
          {[1, 2].map(i => <div key={i} className='h-9 rounded bg-slate-100 dark:bg-slate-800 animate-pulse' />)}
        </div>
      ) : list.length > 0 ? (
        <div className='border rounded-lg overflow-hidden mb-4'>
          <div className='grid grid-cols-[1fr_auto_auto_auto] gap-x-3 bg-muted px-3 py-2 text-xs font-bold'>
            <span>Name</span>
            <span>Amount</span>
            <span>Due</span>
            <span></span>
          </div>
          {list.map(r => (
            <div key={r.id} className='grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-3 py-2 border-t text-sm items-center'>
              <span className='truncate font-medium'>{r.name}</span>
              <span>${Number(r.amount).toFixed(2)}</span>
              <span className='text-muted-foreground whitespace-nowrap'>{ordinal(r.dueDay)}</span>
              <Trash
                className='h-4 w-4 text-red-500 cursor-pointer hover:text-red-700'
                onClick={() => handleDelete(r.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground mb-4'>No recurring expenses yet.</p>
      )}

      <div className='flex flex-col sm:flex-row gap-2'>
        <Input
          placeholder='Name'
          value={name}
          onChange={e => setName(e.target.value)}
          className='flex-1'
        />
        <Input
          placeholder='Amount'
          type='number'
          min='0.01'
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className='w-full sm:w-28'
        />
        <div className='relative w-full sm:w-32 flex-shrink-0'>
          <select
            value={dueDay}
            onChange={e => setDueDay(e.target.value)}
            className='w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground'
          >
            <option value=''>Due day…</option>
            {DAY_OPTIONS.map(d => (
              <option key={d} value={d}>{ordinal(d)}</option>
            ))}
          </select>
          <ChevronDown className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        </div>
        <Button disabled={!isValid || loading} onClick={handleAdd} className='flex-shrink-0'>
          {loading ? <Loader className='animate-spin h-4 w-4' /> : 'Add'}
        </Button>
      </div>
      <p className='text-xs text-muted-foreground mt-2'>
        Recurring expenses auto-apply on their due date when you continue a budget period. They are removed if you start fresh.
      </p>
    </div>
  )
}

export default RecurringExpenseSection
