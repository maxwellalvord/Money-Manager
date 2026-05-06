import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { AlertTriangle, Loader } from 'lucide-react';
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
                isOverride: overrideBudget ? 1 : 0,
            });
            if (res) {
                if (clearOnSubmit === 1) {
                    setName('');
                    setAmount('');
                }
                setOverrideBudget(false);
                refreshData();
                toast(overrideBudget ? 'Expense Added (Budget Override)' : 'Expense Added Successfully');
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
    const [overrideBudget, setOverrideBudget] = useState(false);
    const [loading, setLoading] = useState(false);

    const numericAmount = Number(amount);
    const isValidAmount = amount && !isNaN(numericAmount) && numericAmount > 0;
    const amountWithinBudget = remaining === undefined || numericAmount <= remaining;
    const showOverrideOption = remaining !== undefined && amount && !amountWithinBudget;
    const isDisabled = !(name && isValidAmount && (amountWithinBudget || overrideBudget));

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        setOverrideBudget(false);
    }

    return (
        <div className='border p-5 rounded-lg'>
            <div className='flex flex-wrap justify-between items-center gap-2 mb-4'>
                <h2 className='font-bold text-lg'>Add Expense</h2>
                <Button variant='outline' size='sm' onClick={() => setClearOnSubmit(clearOnSubmit ? 0 : 1)}>
                    <span className="hidden sm:inline">{clearOnSubmit ? 'Clear contents on submit: Enabled' : 'Clear contents on submit: Disabled'}</span>
                    <span className="sm:hidden">{clearOnSubmit ? 'Clear: On' : 'Clear: Off'}</span>
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
                    onChange={handleAmountChange}
                />
                {showOverrideOption && (
                    <div className='mt-2 space-y-2'>
                        <p className="text-sm text-red-500">
                            Amount exceeds remaining budget (${remaining.toFixed(2)}).
                        </p>
                        <label className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${overrideBudget ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-border text-muted-foreground hover:border-amber-300'}`}>
                            <input
                                type="checkbox"
                                checked={overrideBudget}
                                onChange={(e) => setOverrideBudget(e.target.checked)}
                                className="accent-amber-500"
                            />
                            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            Override budget limit
                        </label>
                    </div>
                )}
            </div>
            <Button disabled={isDisabled || loading} onClick={() => addNewExpense()} className="mt-3 w-full">
                {loading ? <Loader className='animate-spin' /> : "Add New Expense"}
            </Button>
        </div>
    )
}

export default AddExpense
