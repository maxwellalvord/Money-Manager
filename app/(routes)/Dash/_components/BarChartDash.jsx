import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDash({ budgetList }) {
  return (
    <div className='border rounded-lg p-5 w-full'>
      <h2 className='font-bold text-lg'> Budget Activity</h2>
      <div className='w-full h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={budgetList}
            margin={{ top: 8, left: 0, right: 0, bottom: 0 }}
          >
            <XAxis dataKey="name" style={{ fontWeight: 400 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSpend" stackId="A" fill="#25158F" />
            <Bar dataKey="amount" stackId="A" fill="#64A8ED" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartDash