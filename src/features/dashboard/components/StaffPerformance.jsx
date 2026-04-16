import React from 'react';
import { Star, Target } from 'lucide-react';

const staffPoints = [
  { name: "Rahul Kumar", services: 42, revenue: 12500, emoji: "💇‍♂️", progress: 85, rating: 4.8, target: 15000 },
  { name: "Priya Verma", services: 38, revenue: 9800, emoji: "💅", progress: 65, rating: 4.9, target: 15000 },
  { name: "Amit Singh", services: 35, revenue: 8200, emoji: "💈", progress: 54, rating: 4.5, target: 15000 },
];

const StaffPerformance = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-jost">Staff Performance</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Top Earner Metrics</p>
        </div>
        <select className="bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 px-2 py-1 outline-none">
          <option>This Month</option>
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>
      
      <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {staffPoints.map((staff, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl shadow-sm border border-purple-100 group-hover:scale-105 transition-transform">
                    {staff.emoji}
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] shadow-sm border-2 border-white">
                      👑
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{staff.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-medium">{staff.services} Services</span>
                    <span className="text-[10px] text-slate-300">|</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star size={10} className="fill-amber-400" />
                      <span className="text-[10px] font-bold">{staff.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-purple-600">₹{staff.revenue.toLocaleString()}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
                  <Target size={10} />
                  ₹{staff.target.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[10px] font-bold">
                 <span className="text-slate-500">Target Achievement</span>
                 <span className={staff.progress > 80 ? "text-green-600" : "text-purple-600"}>{staff.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${staff.progress > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-purple-400 to-purple-500'}`}
                  style={{ width: `${staff.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPerformance;
