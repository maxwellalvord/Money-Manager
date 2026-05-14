'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function DeleteExpenseDialog({ open, onConfirm, onCancel }) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel() }}>
            <DialogContent showCloseButton={false} className='sm:max-w-sm'>
                <DialogHeader>
                    <DialogTitle>Delete Expense</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                    Are you sure you want to delete this expense? This action cannot be undone.
                </p>
                <DialogFooter>
                    <Button variant='outline' onClick={onCancel}>Cancel</Button>
                    <Button variant='destructive' onClick={onConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteExpenseDialog
