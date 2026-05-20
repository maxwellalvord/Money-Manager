"use client"

import React, { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DOT_COLORS = [
  'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
  'bg-red-400', 'bg-amber-500', 'bg-indigo-400',
]

function buildMonthData(displayYear, displayMonth, todayYear, todayMonth, todayDate, budgetEndDay, budgetList) {
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay()
  const isCurrentMonth = displayYear === todayYear && displayMonth === todayMonth

  const endDay = budgetEndDay ? Math.min(budgetEndDay, daysInMonth) : null
  const wrapsToNextMonth = isCurrentMonth && endDay !== null && endDay < todayDate

  const dueBudgets = budgetList
    .filter(b => !b.isSavings && b.dueDate)
    .map((b, idx) => {
      const dueDay = new Date(b.dueDate + 'T00:00:00').getDate()
      return { ...b, dueDay: Math.min(dueDay, daysInMonth), colorIdx: idx % DOT_COLORS.length }
    })

  const dueDateMap = {}
  dueBudgets.forEach(b => {
    if (!dueDateMap[b.dueDay]) dueDateMap[b.dueDay] = []
    dueDateMap[b.dueDay].push(b)
  })

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return { daysInMonth, isCurrentMonth, endDay, wrapsToNextMonth, dueBudgets, dueDateMap, cells }
}

function MonthGrid({ displayYear, displayMonth, todayYear, todayMonth, todayDate, budgetEndDay, budgetList, compact = false }) {
  const { isCurrentMonth, endDay, wrapsToNextMonth, dueDateMap, cells } =
    buildMonthData(displayYear, displayMonth, todayYear, todayMonth, todayDate, budgetEndDay, budgetList)

  const cellSize = compact ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'
  const dotSize = compact ? 'h-1 w-1' : 'h-1.5 w-1.5'
  const dayNames = compact ? DAY_NAMES_SHORT : DAY_NAMES

  return (
    <div>
      <div className="text-center font-semibold text-sm mb-2">
        {MONTH_NAMES[displayMonth]} {displayYear}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const isToday = isCurrentMonth && day === todayDate
          const isEndDay = endDay !== null && day === endDay
          const isPast = isCurrentMonth && day < todayDate
          const isAfterEnd = !wrapsToNextMonth && endDay !== null && day > endDay
          const dayDueBudgets = dueDateMap[day] || []

          let cellClass = `flex items-center justify-center rounded-full ${cellSize} mx-auto transition-colors `
          if (isToday && isEndDay) {
            cellClass += 'bg-primary text-white ring-2 ring-offset-1 ring-primary font-bold'
          } else if (isToday) {
            cellClass += 'bg-primary text-white font-bold'
          } else if (isEndDay) {
            cellClass += 'bg-orange-500 text-white font-bold'
          } else if (isAfterEnd) {
            cellClass += 'text-muted-foreground/40'
          } else if (isPast) {
            cellClass += 'text-muted-foreground/50'
          } else {
            cellClass += 'text-foreground'
          }

          return (
            <div key={day} className="flex flex-col items-center pb-0.5">
              <div className={cellClass}>{day}</div>
              {dayDueBudgets.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {dayDueBudgets.map((b) => (
                    <span key={b.id} title={b.name} className={`${dotSize} rounded-full ${DOT_COLORS[b.colorIdx]}`} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BudgetCalendar({ budgetEndDay, budgetList = [] }) {
  const [view, setView] = useState('current') // 'current' | 'next' | 'split'

  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const nextMonthDate = new Date(todayYear, todayMonth + 1, 1)
  const nextYear = nextMonthDate.getFullYear()
  const nextMonth = nextMonthDate.getMonth()

  // Days remaining in period (always based on current month context)
  const daysInCurrentMonth = new Date(todayYear, todayMonth + 1, 0).getDate()
  const endDay = budgetEndDay ? Math.min(budgetEndDay, daysInCurrentMonth) : null
  const wrapsToNextMonth = endDay !== null && endDay < todayDate

  let daysRemaining = null
  if (endDay !== null) {
    if (!wrapsToNextMonth) {
      daysRemaining = endDay - todayDate
    } else {
      const nextMonthDays = new Date(todayYear, todayMonth + 2, 0).getDate()
      daysRemaining = daysInCurrentMonth - todayDate + Math.min(budgetEndDay, nextMonthDays)
    }
  }

  const allDueBudgets = budgetList
    .filter(b => !b.isSavings && b.dueDate)
    .map((b, idx) => ({
      ...b,
      dueDay: new Date(b.dueDate + 'T00:00:00').getDate(),
      colorIdx: idx % DOT_COLORS.length,
    }))

  const sharedGridProps = { todayYear, todayMonth, todayDate, budgetEndDay, budgetList }

  return (
    <div className="border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-lg">Budget Calendar</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('current')}
            title="Current month"
            className={`p-1.5 rounded-md text-xs transition-colors ${view === 'current' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('split')}
            title="Split view"
            className={`p-1.5 rounded-md text-xs transition-colors ${view === 'split' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('next')}
            title="Next month"
            className={`p-1.5 rounded-md text-xs transition-colors ${view === 'next' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid(s) */}
      {view === 'current' && (
        <MonthGrid displayYear={todayYear} displayMonth={todayMonth} {...sharedGridProps} />
      )}

      {view === 'next' && (
        <MonthGrid displayYear={nextYear} displayMonth={nextMonth} {...sharedGridProps} />
      )}

      {view === 'split' && (
        <div className="grid grid-cols-2 gap-4">
          <MonthGrid displayYear={todayYear} displayMonth={todayMonth} compact {...sharedGridProps} />
          <MonthGrid displayYear={nextYear} displayMonth={nextMonth} compact {...sharedGridProps} />
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-3 border-t space-y-2">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-primary inline-block" /> Today
          </span>
          {endDay && (
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-orange-500 inline-block" /> Period ends
            </span>
          )}
        </div>

        {allDueBudgets.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            {allDueBudgets.map((b) => {
              const isPastThisMonth = b.dueDay < todayDate
              const labelMonth = isPastThisMonth ? nextMonth : todayMonth
              const labelYear = isPastThisMonth ? nextYear : todayYear
              return (
                <span key={b.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${DOT_COLORS[b.colorIdx]}`} />
                  {b.icon} {b.name} — due {MONTH_NAMES[labelMonth]} {b.dueDay}{isPastThisMonth ? ` (${labelYear})` : ''}
                </span>
              )
            })}
          </div>
        )}

        {endDay && (
          <div className="text-sm font-medium text-green-600">
            {daysRemaining === 0
              ? 'Budget period ends today!'
              : wrapsToNextMonth
                ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining (ends ${MONTH_NAMES[nextMonth]} ${endDay})`
                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining in budget period`
            }
          </div>
        )}

        {!endDay && (
          <p className="text-xs text-muted-foreground">
            No budget end day set. Use &quot;Edit Monthly Budget&quot; to set one.
          </p>
        )}
      </div>
    </div>
  )
}

export default BudgetCalendar
