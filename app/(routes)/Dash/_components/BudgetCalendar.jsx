"use client"

import React from 'react'
import { CalendarDays } from 'lucide-react'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function BudgetCalendar({ budgetEndDay }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const endDay = budgetEndDay
    ? Math.min(budgetEndDay, daysInMonth)
    : null

  const daysRemaining = endDay ? endDay - todayDate : null
  const periodEnded = daysRemaining !== null && daysRemaining < 0

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <div className="border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Budget Calendar</h2>
      </div>

      {/* Month header */}
      <div className="text-center font-semibold text-base mb-3">
        {MONTH_NAMES[month]} {year}
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const isToday = day === todayDate
          const isEndDay = endDay !== null && day === endDay
          const isPast = day < todayDate
          const isAfterEnd = endDay !== null && day > endDay

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
            <div key={day} className={cellClass}>
              {day}
            </div>
          )
        })}
      </div>

      {/* Legend & countdown */}
      <div className="mt-4 pt-3 border-t space-y-2">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-primary inline-block" /> Today
          </span>
          {endDay && (
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-orange-500 inline-block" /> Budget ends
            </span>
          )}
        </div>

        {endDay && (
          <div className={`text-sm font-medium ${periodEnded ? 'text-red-500' : 'text-green-600'}`}>
            {periodEnded
              ? `Budget period ended ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago`
              : daysRemaining === 0
                ? 'Budget period ends today!'
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
