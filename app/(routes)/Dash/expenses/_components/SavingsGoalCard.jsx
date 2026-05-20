'use client'

import React, { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { updateSavingsGoal } from '@/app/actions/budgets'
import { toast } from 'sonner'

function SavingsGoalCard({ budget, onRefresh }) {
    const [editOpen, setEditOpen] = useState(false)
    const [goalInput, setGoalInput] = useState('')

    const goal = Number(budget?.savingsGoal) || 0
    const saved = Number(budget?.amount) || 0
    const progress = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0
    const remaining = Math.max(0, goal - saved)

    const handleEdit = () => {
        setGoalInput(goal > 0 ? String(goal) : '')
        setEditOpen(true)
    }

    const handleSave = async () => {
        const parsed = Number(goalInput)
        if (!parsed || parsed <= 0) return
        try {
            await updateSavingsGoal(budget.id, parsed)
            toast.success('Savings goal updated!')
            setEditOpen(false)
            onRefresh()
        } catch {
            toast.error('Failed to update savings goal.')
        }
    }

    const handleRemove = async () => {
        try {
            await updateSavingsGoal(budget.id, null)
            toast.success('Savings goal removed.')
            setEditOpen(false)
            onRefresh()
        } catch {
            toast.error('Failed to remove savings goal.')
        }
    }

    if (!goal) {
        return (
            <>
                <div
                    onClick={handleEdit}
                    className='p-5 border border-dashed rounded-lg cursor-pointer hover:shadow-md h-[170px] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
                >
                    <Pencil className='h-5 w-5' />
                    <p className='text-sm font-medium'>Set a Savings Goal</p>
                </div>

                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent showCloseButton={false} className='sm:max-w-sm'>
                        <DialogHeader>
                            <DialogTitle>Set Savings Goal</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder='e.g. 10000'
                            type='number'
                            min='1'
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        <DialogFooter>
                            <Button variant='outline' onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button disabled={!goalInput || Number(goalInput) <= 0} onClick={handleSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    return (
        <>
            <div className='p-5 border border-yellow-400 bg-yellow-50/40 dark:bg-yellow-900/10 rounded-lg h-[170px] flex flex-col justify-between'>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wide font-medium'>Savings Goal</p>
                        <p className='text-2xl font-bold text-yellow-600'>${goal.toLocaleString()}</p>
                    </div>
                    <Button variant='ghost' size='icon-sm' onClick={handleEdit}>
                        <Pencil className='h-4 w-4' />
                    </Button>
                </div>

                <div>
                    <div className='flex items-center justify-between mb-2 text-xs text-slate-400'>
                        <span>${saved.toFixed(2)} saved</span>
                        <span>${remaining.toFixed(2)} to go</span>
                    </div>
                    <div className='w-full bg-slate-300 dark:bg-slate-600 h-2 rounded-full'>
                        <div
                            className='h-2 rounded-full bg-yellow-400 transition-all'
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className='text-xs text-right text-muted-foreground mt-1'>{progress.toFixed(1)}%</p>
                </div>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent showCloseButton={false} className='sm:max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>Edit Savings Goal</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder='e.g. 10000'
                        type='number'
                        min='1'
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <DialogFooter className='flex-col sm:flex-row gap-2'>
                        <Button variant='ghost' className='text-destructive hover:text-destructive sm:mr-auto' onClick={handleRemove}>
                            Remove Goal
                        </Button>
                        <Button variant='outline' onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button disabled={!goalInput || Number(goalInput) <= 0} onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SavingsGoalCard
