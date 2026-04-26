import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const RevenueTrendChart = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-jost">Revenue Trend</h3>
          <p className="text-sm text-slate-500">Last 7 days performance</p>
        </div>
        <select className="bg-slate-50 border-none rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 outline-none cursor-pointer">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              tickFormatter={(value) => `AED ${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '600'
              }}
              formatter={(value) => [`AED ${value}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
