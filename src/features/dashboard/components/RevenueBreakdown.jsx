import React from 'react';
import { ArrowUpRight, ArrowDownRight, IndianRupee, ShoppingBag, Scissors } from 'lucide-react';

const RevenueBreakdown = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 font-jost">Revenue Comparison</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Detailed Analytics</span>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Comparison Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Today vs Yesterday</p>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-100/50 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={12} />
                +12%
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xl font-bold text-slate-900">AED 4,250</p>
                <p className="text-[10px] text-slate-400 font-medium">Avg: AED 354/booking</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Yesterday: AED 3,100</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Month-to-Date</p>
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-100/50 px-2 py-0.5 rounded-full">
                <ArrowDownRight size={12} />
                -4.5%
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xl font-bold text-slate-900">AED 1,45,200</p>
                <p className="text-[10px] text-slate-400 font-medium">AOV: AED 1,120</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Target: AED 1.6L</p>
            </div>
          </div>
        </div>

        {/* Revenue Split */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Channel Distribution</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <Scissors size={14} className="text-indigo-600" />
                  <span>Services</span>
                </div>
                <span className="font-bold text-slate-900">AED 1,18,000 (82%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <ShoppingBag size={14} className="text-purple-600" />
                  <span>Retail/Products</span>
                </div>
                <span className="font-bold text-slate-900">AED 27,200 (18%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Clients</p>
          <p className="text-lg font-bold text-slate-800">24 <span className="text-[10px] text-green-500">+4</span></p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Retention</p>
          <p className="text-lg font-bold text-slate-800">68% <span className="text-[10px] text-indigo-500">Optimum</span></p>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
