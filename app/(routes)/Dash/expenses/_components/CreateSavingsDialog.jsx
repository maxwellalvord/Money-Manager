'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Loader, PiggyBank } from 'lucide-react'
import { toast } from 'sonner'
import { createSavingsBudget } from '@/app/actions/savings'

function CreateSavingsDialog({ open, onOpenChange, onCreated }) {
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('🏦')
    const [goal, setGoal] = useState('')
    const [loading, setLoading] = useState(false)

    const isValid = name.trim().length > 0

    const handleCreate = async () => {
        if (!isValid) return
        setLoading(true)
        try {
            const budget = await createSavingsBudget({
                name: name.trim(),
                icon: icon.trim() || '🏦',
                savingsGoal: goal ? Number(goal) : null,
            })
            toast.success(`"${budget.name}" savings account created!`)
            setName('')
            setIcon('🏦')
            setGoal('')
            onOpenChange(false)
            onCreated?.(budget)
        } catch {
            toast.error('Failed to create savings account.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className='sm:max-w-sm'>
                <DialogHeader>
                    <div className='flex items-center gap-2 mb-1'>
                        <PiggyBank className='h-5 w-5 text-yellow-500' />
                        <DialogTitle>New Savings Account</DialogTitle>
                    </div>
                </DialogHeader>

                <div className='space-y-3'>
                    <div>
                        <p className='text-sm font-medium mb-1'>Account Name</p>
                        <Input
                            placeholder='e.g. Emergency Fund'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !loading && isValid && handleCreate()}
                        />
                    </div>

                    <div>
                        <p className='text-sm font-medium mb-1'>Emoji</p>
                        <Input
                            placeholder='🏦'
                            value={icon}
                            onChange={e => setIcon(e.target.value)}
                            className='w-24'
                        />
                    </div>

                    <div>
                        <p className='text-sm font-medium mb-1'>Savings Goal <span className='text-muted-foreground font-normal'>(optional)</span></p>
                        <Input
                            placeholder='e.g. 5000'
                            type='number'
                            min='1'
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !loading && isValid && handleCreate()}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={!isValid || loading} onClick={handleCreate}>
                        {loading ? <Loader className='animate-spin h-4 w-4' /> : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateSavingsDialog
