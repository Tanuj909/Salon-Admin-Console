import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Haircut', value: 45, color: '#6366f1' },
  { name: 'Facial', value: 25, color: '#a855f7' },
  { name: 'Spa', value: 15, color: '#ec4899' },
  { name: 'Coloring', value: 10, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#94a3b8' },
];

const ServicePopularityChart = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-2 font-jost">Service Popularity</h3>
      <p className="text-sm text-slate-500 mb-6">Distribution of services</p>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicePopularityChart;
