"use client"
import React, { useState } from 'react'
import { AlertCircle, AlertTriangle, ChevronDown, FileText } from 'lucide-react'

function MonthlyStatement({ statement }) {
  const [expanded, setExpanded] = useState({})

  if (!statement) return null

  const { periodLabel, monthlyBudget, totalSpent, savedAmount, budgetBreakdown, periodEnd } = statement
  const remaining = monthlyBudget - totalSpent
  const usedPct = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0
  const date = new Date(periodEnd).toLocaleDateString('default', { dateStyle: 'medium' })

  const toggle = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div className='border rounded-lg p-5 mt-5'>
      <div className='flex items-center gap-2 mb-1'>
        <FileText className='h-5 w-5 text-primary' />
        <h2 className='font-bold text-lg'>Last Month&apos;s Statement</h2>
      </div>
      <p className='text-xs text-muted-foreground mb-4'>{periodLabel} — generated {date}</p>

      {/* Summary row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5'>
        <div className='bg-accent rounded-lg p-3'>
          <p className='text-xs text-muted-foreground'>Monthly Budget</p>
          <p className='font-bold text-base'>${monthlyBudget.toLocaleString()}</p>
        </div>
        <div className='bg-accent rounded-lg p-3'>
          <p className='text-xs text-muted-foreground'>Total Spent</p>
          <p className='font-bold text-base'>${totalSpent.toFixed(2)}</p>
        </div>
        <div className='bg-accent rounded-lg p-3'>
          <p className='text-xs text-muted-foreground'>Remaining</p>
          <p className={`font-bold text-base ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            ${remaining.toFixed(2)}
          </p>
        </div>
        <div className='bg-accent rounded-lg p-3'>
          <p className='text-xs text-muted-foreground'>Moved to Savings</p>
          <p className='font-bold text-base text-yellow-600'>${savedAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Overall usage bar */}
      <div className='mb-5'>
        <div className='flex justify-between text-xs text-muted-foreground mb-1'>
          <span>Overall budget used</span>
          <span>{usedPct.toFixed(1)}%</span>
        </div>
        <div className='w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full'>
          <div
            className={`h-2 rounded-full transition-all ${usedPct >= 100 ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${usedPct}%` }}
          />
        </div>
      </div>

      {/* Per-budget breakdown */}
      {budgetBreakdown.length > 0 ? (
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>Budget Breakdown</h3>
          {budgetBreakdown.map((b, i) => {
            const pct = b.amount > 0 ? Math.min((b.totalSpend / b.amount) * 100, 100) : 0
            const bRemaining = b.amount - b.totalSpend
            const hasExpenseOverride = b.overrideCount > 0
            const hasBudgetOverride = !!b.budgetOverride
            const expenses = b.expenses || []
            const isOpen = !!expanded[i]

            return (
              <div key={i} className='border rounded-lg overflow-hidden'>
                {/* Header row — clickable */}
                <button
                  className='w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors'
                  onClick={() => toggle(i)}
                >
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium flex items-center gap-1.5 flex-wrap'>
                      {b.icon} {b.name}
                      {hasBudgetOverride && (
                        <span className='inline-flex items-center gap-1 text-xs font-normal text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded px-1.5 py-0.5'>
                          <AlertCircle className='h-3 w-3' />
                          allocation override
                        </span>
                      )}
                      {hasExpenseOverride && (
                        <span className='inline-flex items-center gap-1 text-xs font-normal text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded px-1.5 py-0.5'>
                          <AlertTriangle className='h-3 w-3' />
                          {b.overrideCount} expense override{b.overrideCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                    <div className='flex items-center gap-3'>
                      <span className='text-muted-foreground'>
                        ${b.totalSpend.toFixed(2)} <span className='text-xs'>/ ${b.amount.toLocaleString()}</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className='flex items-center gap-2 mt-2'>
                    <div className='flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full'>
                      <div
                        className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-xs w-16 text-right ${bRemaining < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {bRemaining < 0 ? '-' : ''}${Math.abs(bRemaining).toFixed(2)} {bRemaining < 0 ? 'over' : 'left'}
                    </span>
                  </div>

                  {hasBudgetOverride && (
                    <p className='text-xs text-purple-600 dark:text-purple-400 mt-1'>
                      Budget exceeded monthly allocation when created
                    </p>
                  )}
                  {hasExpenseOverride && (
                    <p className='text-xs text-amber-600 dark:text-amber-400 mt-1'>
                      ${Number(b.overrideAmount).toFixed(2)} spent via expense override{b.overrideCount > 1 ? 's' : ''}
                    </p>
                  )}
                </button>

                {/* Expense list */}
                {isOpen && (
                  <div className='border-t bg-accent/30 px-4 py-3'>
                    {expenses.length > 0 ? (
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='text-xs text-muted-foreground'>
                            <th className='text-left font-medium pb-2'>Expense</th>
                            <th className='text-right font-medium pb-2'>Amount</th>
                            <th className='text-right font-medium pb-2 pl-3'>Date</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-border'>
                          {expenses.map((exp, j) => (
                            <tr key={j} className={exp.isOverride ? 'text-amber-600 dark:text-amber-400' : ''}>
                              <td className='py-1.5 flex items-center gap-1.5'>
                                {exp.isOverride ? <AlertTriangle className='h-3 w-3 flex-shrink-0' /> : null}
                                {exp.name}
                              </td>
                              <td className='py-1.5 text-right font-medium'>${Number(exp.amount).toFixed(2)}</td>
                              <td className='py-1.5 text-right text-muted-foreground pl-3 text-xs whitespace-nowrap'>
                                {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('default', { month: 'short', day: 'numeric' }) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className='text-xs text-muted-foreground'>No expenses recorded for this budget.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>No individual budgets were tracked this period.</p>
      )}
    </div>
  )
}

export default MonthlyStatement
