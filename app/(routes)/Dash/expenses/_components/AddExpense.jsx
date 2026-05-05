import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { addExpense } from '@/app/actions/expenses'

function AddExpense({ budget, budgetId, refreshData }) {

    const remaining = budget
        ? Number(budget.amount) - Number(budget.totalSpend || 0)
        : undefined;

    const addNewExpense = async () => {
        setLoading(true);
        try {
            const res = await addExpense({
                name,
                amount,
                budgetId,
                createdAt: new Date().toISOString(),
            });
            if (res) {
                if (clearOnSubmit === 1) {
                    setName('');
                    setAmount('');
                }
                refreshData();
                toast('Expense Added Successfully');
            }
        } catch {
            toast.error('Failed to add expense.');
        } finally {
            setLoading(false);
        }
    }

    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [clearOnSubmit, setClearOnSubmit] = useState(1);
    const [loading, setLoading] = useState(false);

    const numericAmount = Number(amount);
    const isValidAmount = amount && !isNaN(numericAmount) && numericAmount > 0;
    const amountWithinBudget = remaining === undefined || numericAmount <= remaining;
    const isDisabled = !(name && isValidAmount && amountWithinBudget);

    return (
        <div className='border p-5 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='font-bold text-lg'>Add Expense</h2>
                <Button variant='outline' onClick={() => setClearOnSubmit(clearOnSubmit ? 0 : 1)}>
                    {clearOnSubmit ? 'Clear contents on submit: Enabled' : 'Clear contents on submit: Disabled'}
                </Button>
            </div>
            <div className='mt-2'>
                <h2 className='text-foreground font-medium my-1'>Expense Name</h2>
                <Input placeholder='e.g. Record Store'
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-foreground font-medium my-1'>Expense Amount</h2>
                <Input placeholder='e.g. 65'
                    value={amount || ''}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {remaining !== undefined && amount && !amountWithinBudget && (
                    <p className="text-sm text-red-500 mt-1">
                        Amount exceeds remaining budget (${remaining}).
                    </p>
                )}
            </div>
            <Button disabled={isDisabled || loading} onClick={() => addNewExpense()} className="mt-3 w-full">
                {loading ? <Loader className='animate-spin' /> : "Add New Expense"}
            </Button>
        </div>
    )
}

export default AddExpense
