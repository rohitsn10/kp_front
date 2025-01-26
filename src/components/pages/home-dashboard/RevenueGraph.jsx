import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
  } from 'recharts';

  const data = [
    { name: 'P1', value: 120 },
    { name: 'P2', value: 300 },
    { name: 'P3', value: 200 },
    { name: 'P4', value: 280 },
    { name: 'P5', value: 190 },
    { name: 'P6', value: 200 },
  ];

function RevenueGraph() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"  label={<Label value={"Projects"} position="insideBottom" offset={-5}/>} />
        <YAxis label={<Label value="Energy Consumed" angle={-90} offset={-10} style={{ textAnchor: 'middle' }} position="left"/>}  />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="value" fill="#F6D02D" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RevenueGraph