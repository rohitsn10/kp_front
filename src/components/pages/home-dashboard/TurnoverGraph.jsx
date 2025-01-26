import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
  } from 'recharts';
  
  const data = [
    { name: 'Q1', value: 700 },
    { name: 'Q2', value: 400 },
    { name: 'Q3', value: 290 },
    { name: 'Q4', value: 578 },
    { name: 'Q1', value: 200 },
    { name: 'Q2', value: 378 },
  ];
function TurnoverGraph() {
  return (
    <ResponsiveContainer width="100%" height={240} >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* X-Axis Configuration */}
        <XAxis dataKey="name">
          <Label value="Months" position="insideBottom" offset={-5} />
        </XAxis>
                {/* <XAxis dataKey="name">
                    <Label value={"Projects"} position="insideBottom" offset={-5}/> 
                </XAxis> */}
        {/* Y-Axis Configuration */}
        <YAxis>
          <Label
            value="Value"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#28a745"
          strokeWidth={2}
          dot={{ fill: '#28a745', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TurnoverGraph