"use client"
import { useUser } from '@clerk/nextjs'
import React, { use, useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpense from '../_components/AddExpense'
import SavingsTransfer from '../_components/SavingsTransfer'
import SavingsHistory from '../_components/SavingsHistory'
import ExpenseListTable from '../_components/ExpenseListTable'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import EditBudget from '../_components/EditBudget'
import { getBudgetById, deleteBudgetWithExpenses } from '@/app/actions/budgets'
import { getExpensesByBudget } from '@/app/actions/expenses'
import SavingsGoalCard from '../_components/SavingsGoalCard'
import RecurringExpenseSection from '../_components/RecurringExpenseSection'
import CreateSavingsDialog from '../_components/CreateSavingsDialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function ExpensesScreen({ params }) {
  const { id } = use(params);
  const { isLoaded, user } = useUser();
  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createSavingsOpen, setCreateSavingsOpen] = useState(false);
  const route = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      getBudgetInfo();
    }
  }, [isLoaded, user])

  const getBudgetInfo = async () => {
    try {
      const [budget, expenses] = await Promise.all([
        getBudgetById(id),
        getExpensesByBudget(id),
      ]);
      setbudgetInfo(budget);
      setExpensesList(expenses);
    } catch (err) {
      console.error('Failed to load budget:', err);
    } finally {
      setLoading(false);
    }
  }

  const deleteBudget = async () => {
    try {
      await deleteBudgetWithExpenses(id);
      toast('Budget Deleted Successfully!');
      route.replace('/Dash/budgets');
    } catch {
      toast.error('Error Deleting Budget!');
    }
  }

  if (loading) {
    return (
      <div className='p-8'>
        <div className='h-9 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-8' />
        <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
          <div className='h-[170px] w-full border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse bg-slate-100 dark:bg-slate-800' />
          <div className='h-[170px] w-full border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse bg-slate-100 dark:bg-slate-800' />
        </div>
        <div className='mt-5 h-[120px] w-full border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse bg-slate-100 dark:bg-slate-800' />
        <div className='mt-8 h-[200px] w-full border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse bg-slate-100 dark:bg-slate-800' />
      </div>
    )
  }

  const isSavings = budgetInfo?.isSavings === 1
  const savingsRemaining = budgetInfo
    ? Math.max(0, Number(budgetInfo.amount) - Number(budgetInfo.totalSpend || 0))
    : 0

  if (isSavings) {
    return (
      <div className='p-8'>
        <h2 className='text-3xl font-bold flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <span className='text-4xl'>{budgetInfo?.icon ?? '💰'}</span>
            {budgetInfo?.name ?? 'Savings'}
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='flex items-center gap-1.5' onClick={() => setCreateSavingsOpen(true)}>
              <Plus className='h-4 w-4' /> New Savings Account
            </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2' variant="destructive"><Trash /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your Savings budget and all its transaction history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
          {budgetInfo
            ? <BudgetItem budget={budgetInfo} />
            : <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse' />
          }
          <SavingsGoalCard budget={budgetInfo} onRefresh={getBudgetInfo} />
        </div>

        <div className='mt-5'>
          <SavingsTransfer
            savingsBudgetId={Number(id)}
            savingsRemaining={savingsRemaining}
            refreshData={getBudgetInfo}
          />
        </div>

        <div className='mt-8'>
          <SavingsHistory expensesList={expensesList} refreshData={getBudgetInfo} />
        </div>

        <CreateSavingsDialog
          open={createSavingsOpen}
          onOpenChange={setCreateSavingsOpen}
          onCreated={(budget) => route.push(`/Dash/expenses/${budget.id}`)}
        />
      </div>
    )
  }

  return (
    <div className='p-8'>
      <h2 className='text-3xl font-bold flex justify-between items-center'>My Expenses
        <div className='flex gap-2 items-center'>
          {budgetInfo ? (
            <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
          ) : (
            <div className='text-sm'>Loading budget...</div>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='flex gap-2' variant="destructive"><Trash /> Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this budget and its associated expenses from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
        {budgetInfo
          ? <BudgetItem budget={budgetInfo} />
          : <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse' />
        }
        <AddExpense
          budget={budgetInfo}
          budgetId={id}
          refreshData={getBudgetInfo}
        />
      </div>
      <div className='mt-5'>
        <RecurringExpenseSection budgetId={id} />
      </div>

      <div className='mt-8'>
        <ExpenseListTable expensesList={expensesList} refreshData={getBudgetInfo} />
      </div>
    </div>
  )
}

export default ExpensesScreen
