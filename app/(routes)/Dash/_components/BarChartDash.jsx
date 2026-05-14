import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from 'next-themes'

const OutlineBar = ({ x, y, width, height, isDark }) => {
  if (!height || height <= 0) return null
  const stroke = isDark ? '#64748b' : '#94a3b8'
  const r = 3
  const left = x + 0.75
  const right = x + width - 0.75
  const top = y + 0.5
  const bottom = y + height
  // open-bottom shape: down left side, arc top-left, across top, arc top-right, down right side
  const fill = isDark ? 'rgba(100,116,139,0.12)' : 'rgba(148,163,184,0.15)'
  const d = `M ${left} ${bottom} V ${top + r} Q ${left} ${top} ${left + r} ${top} H ${right - r} Q ${right} ${top} ${right} ${top + r} V ${bottom} Z`
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={1.5} />
}

function BarChartDash({ budgetList }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const chartData = budgetList
    .filter(b => !b.isSavings)
    .map(b => {
      const amount = Number(b.amount) || 0
      const spent = Number(b.totalSpend) || 0
      return {
        name: b.name,
        Spent: Math.min(spent, amount),
        Available: Math.max(0, amount - spent),
        Over: Math.max(0, spent - amount),
      }
    })

  return (
    <div className='border rounded-lg p-5 w-full'>
      <h2 className='font-bold text-lg'>Budget Activity</h2>
      <div className='w-full h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={chartData} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
            <XAxis dataKey="name" style={{ fontWeight: 400 }} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              labelStyle={{ fontWeight: 600 }}
              itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            />
            <Legend />
            <Bar dataKey="Spent" stackId="a" fill="#25158F" radius={[0, 0, 0, 0]} />
            <Bar
              dataKey="Available"
              stackId="a"
              fill={isDark ? '#64748b' : '#94a3b8'}
              shape={(props) => <OutlineBar {...props} isDark={isDark} />}
            />
            <Bar dataKey="Over" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartDash
