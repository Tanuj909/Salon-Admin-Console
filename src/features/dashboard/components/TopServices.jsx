import React from 'react';
import { Star, Users, ArrowUpRight } from 'lucide-react';

const topServices = [
  { 
    name: "Bridal Makeup", 
    revenue: 45000, 
    bookings: 12, 
    staff: "Priya V.", 
    rating: 4.9,
    trend: "+8%" 
  },
  { 
    name: "Keratin Treatment", 
    revenue: 32000, 
    bookings: 24, 
    staff: "Rahul K.", 
    rating: 4.8,
    trend: "+12%" 
  },
  { 
    name: "Global Hair Color", 
    revenue: 28500, 
    bookings: 35, 
    staff: "Amit S.", 
    rating: 4.7,
    trend: "+5%" 
  },
];

const TopServices = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-jost">Top Services by Revenue</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Performance Metrics</p>
        </div>
        <button className="text-indigo-600 font-bold text-xs hover:underline">Full Report</button>
      </div>
      
      <div className="space-y-4 flex-1">
        {topServices.map((service, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 group hover:border-indigo-200 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{service.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-slate-500">{service.rating}</span>
                    <span className="text-[10px] text-slate-300 mx-1">|</span>
                    <span className="text-[10px] font-bold text-slate-500">{service.bookings} Bookings</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">₹{service.revenue.toLocaleString()}</p>
                <div className="flex items-center justify-end gap-0.5 text-[10px] font-bold text-green-600 mt-1">
                   {service.trend}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                  {service.staff.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-[10px] text-slate-500 font-medium italic">Most requested: <span className="text-slate-700 font-bold not-italic">{service.staff}</span></p>
              </div>
              <ArrowUpRight size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">High Traffic Alert</span>
         </div>
         <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">86% Capcity</span>
      </div>
    </div>
  );
};

export default TopServices;
