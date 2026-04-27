import React from 'react'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDash({ budgetList }) {
  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'> Budget Activity</h2>
      <BarChart
        width={500}
        height={300}
        data={budgetList}
        margin={{top: 8}}
      >
        <XAxis dataKey="name" style={{ fontWeight: 400 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSpend" stackId="A" fill="#25158F" />
        <Bar dataKey="amount" stackId="A" fill="#64A8ED" />
      </BarChart>
    </div>
  )
}

export default BarChartDash