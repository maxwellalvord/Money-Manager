"use client"

import React from 'react'
import { CalendarDays } from 'lucide-react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DOT_COLORS = [
  'bg-purple-500', 'bg-pink-500', 'bg-teal-500',
  'bg-red-400', 'bg-amber-500', 'bg-indigo-400',
]

function BudgetCalendar({ budgetEndDay, budgetList = [] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const endDay = budgetEndDay
    ? Math.min(budgetEndDay, daysInMonth)
    : null

  let daysRemaining = null
  if (endDay !== null) {
    if (endDay >= todayDate) {
      daysRemaining = endDay - todayDate
    } else {
      const nextMonthDays = new Date(year, month + 2, 0).getDate()
      const nextEndDay = Math.min(budgetEndDay, nextMonthDays)
      daysRemaining = daysInMonth - todayDate + nextEndDay
    }
  }
  const wrapsToNextMonth = endDay !== null && endDay < todayDate

  // Build a map of day → budgets due that day (current month only, non-savings)
  const dueDateMap = {}
  const dueBudgets = budgetList.filter(b => !b.isSavings && b.dueDate)
  dueBudgets.forEach((b, idx) => {
    const d = new Date(b.dueDate + 'T00:00:00')
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!dueDateMap[day]) dueDateMap[day] = []
      dueDateMap[day].push({ ...b, colorIdx: idx % DOT_COLORS.length })
    }
  })

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Budget Calendar</h2>
      </div>

      <div className="text-center font-semibold text-base mb-3">
        {MONTH_NAMES[month]} {year}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const isToday = day === todayDate
          const isEndDay = endDay !== null && day === endDay
          const isPast = day < todayDate
          const isAfterEnd = !wrapsToNextMonth && endDay !== null && day > endDay
          const dayDueBudgets = dueDateMap[day] || []

          let cellClass = 'flex items-center justify-center rounded-full h-8 w-8 mx-auto text-sm transition-colors '
          if (isToday && isEndDay) {
            cellClass += 'bg-primary text-white ring-2 ring-offset-1 ring-primary font-bold'
          } else if (isToday) {
            cellClass += 'bg-primary text-white font-bold'
          } else if (isEndDay) {
            cellClass += 'bg-orange-500 text-white font-bold'
          } else if (isAfterEnd) {
            cellClass += 'text-muted-foreground/40'
          } else if (isPast) {
            cellClass += 'text-muted-foreground'
          } else {
            cellClass += 'text-foreground'
          }

          return (
            <div key={day} className="flex flex-col items-center pb-1">
              <div className={cellClass}>{day}</div>
              {dayDueBudgets.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {dayDueBudgets.map((b) => (
                    <span
                      key={b.id}
                      title={b.name}
                      className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[b.colorIdx]}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

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

        {/* Due date budget legend */}
        {dueBudgets.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            {dueBudgets.map((b, idx) => (
              <span key={b.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${DOT_COLORS[idx % DOT_COLORS.length]}`} />
                {b.icon} {b.name} — due {new Date(b.dueDate + 'T00:00:00').getDate()}
              </span>
            ))}
          </div>
        )}

        {endDay && (
          <div className="text-sm font-medium text-green-600">
            {daysRemaining === 0
              ? 'Budget period ends today!'
              : wrapsToNextMonth
                ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining (ends ${MONTH_NAMES[month === 11 ? 0 : month + 1]} ${endDay})`
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
