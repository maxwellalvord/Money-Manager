import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDash({ budgetList }) {
  const chartData = budgetList
    .filter(b => !b.isSavings)
    .map(b => {
      const amount = Number(b.amount) || 0
      const spent = Number(b.totalSpend) || 0
      return {
        name: b.name,
        Spent: Math.min(spent, amount),
        Remaining: Math.max(0, amount - spent),
        Over: Math.max(0, spent - amount),
      }
    })

  return (
    <div className='border rounded-lg p-5 w-full'>
      <h2 className='font-bold text-lg'>Budget Activity</h2>
      <div className='w-full h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 8, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" style={{ fontWeight: 400 }} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
              contentStyle={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#f8f8f2',
              }}
              labelStyle={{ color: '#f8f8f2', fontWeight: 600 }}
              itemStyle={{ color: '#f8f8f2' }}
            />
            <Legend />
            <Bar dataKey="Spent" stackId="A" fill="#25158F" />
            <Bar dataKey="Remaining" stackId="A" fill="#64A8ED" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Over" stackId="A" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartDash
