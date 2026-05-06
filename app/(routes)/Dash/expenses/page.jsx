"use client"
import React, { useState, useEffect, useMemo } from 'react'
import ExpenseListTable from './_components/ExpenseListTable'
import { useUser } from '@clerk/nextjs'
import { PiggyBank, ReceiptText, TrendingUp, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getExpensesByUser, getBudgetsWithSpendForExpenses } from '@/app/actions/expenses'
import { getSettings } from '@/app/actions/settings'

const COLORS = ['#534AB7', '#1D9E75', '#BA7517', '#D4537E', '#378ADD', '#639922']

function Expenses() {
  const [expensesList, setExpensesList] = useState([])
  const [budgetList, setBudgetList] = useState([])
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const { isLoaded, user } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      loadData()
    }
  }, [isLoaded, user])

  const loadData = async () => {
    try {
      const [expenses, budgets, settings] = await Promise.all([
        getExpensesByUser(),
        getBudgetsWithSpendForExpenses(),
        getSettings(),
      ]);
      setExpensesList(expenses)
      setBudgetList(budgets)
      if (settings.length > 0) setMonthlyBudget(Number(settings[0].monthlyBudget))
    } catch (err) {
      console.error('Failed to load expenses:', err)
    }
  }

  const totalSpent = useMemo(
    () => budgetList
      .filter(b => !b.isSavings)
      .reduce((sum, b) => sum + Number(b.totalSpend || 0), 0),
    [budgetList]
  )

  const budgetRemaining = monthlyBudget - totalSpent

  const avgExpense = expensesList.length
    ? (totalSpent / expensesList.length).toFixed(2)
    : '0.00'

  const pieData = budgetList
    .filter((b) => !b.isSavings && b.totalSpend > 0)
    .map((b) => ({ name: b.name, value: b.totalSpend, icon: b.icon }))

  return (
    <div className="p-6 flex flex-col gap-5" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className='flex items-center gap-3'>
        <h2 className="font-bold text-2xl">My Expenses</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-accent rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <PiggyBank className="bg-primary p-2 h-10 w-10 rounded-full text-primary-foreground flex-shrink-0" />
        </div>
        <div className="bg-accent rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">No. of Expenses</p>
            <p className="text-2xl font-bold">{expensesList.length}</p>
          </div>
          <ReceiptText className="bg-primary p-2 h-10 w-10 rounded-full text-primary-foreground flex-shrink-0" />
        </div>
        <div className="bg-accent rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Avg per Expense</p>
            <p className="text-2xl font-bold">${avgExpense}</p>
          </div>
          <TrendingUp className="bg-primary p-2 h-10 w-10 rounded-full text-primary-foreground flex-shrink-0" />
        </div>
        <div className="bg-accent rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Budget Remaining</p>
            <p className={`text-2xl font-bold ${budgetRemaining < 0 ? 'text-red-500' : ''}`}>
              ${budgetRemaining.toFixed(2)}
            </p>
            {monthlyBudget > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">of ${monthlyBudget.toLocaleString()}</p>
            )}
          </div>
          <Wallet className={`p-2 h-10 w-10 rounded-full text-primary-foreground flex-shrink-0 ${budgetRemaining < 0 ? 'bg-red-500' : 'bg-primary'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="border rounded-lg p-5 flex flex-col">
          <h3 className="font-bold text-lg mb-4">Spending by Budget</h3>
          {pieData.length > 0 ? (
            <>
              <div className="flex-1" style={{ minHeight: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius="45%" outerRadius="70%" dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="flex-1 text-gray-600">{entry.icon} {entry.name}</span>
                    <span className="font-medium">${Number(entry.value).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No spending data yet.</p>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-5 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ExpenseListTable expensesList={expensesList} refreshData={loadData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Expenses
