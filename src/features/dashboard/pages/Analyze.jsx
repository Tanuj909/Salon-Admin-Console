import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Map, 
  Target,
  ArrowUpRight,
  Filter
} from 'lucide-react';

const Analyze = () => {
  const metrics = [
    { label: "Market Share", value: "64%", icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Retention Rate", value: "82%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "City Expansion", value: "+4", icon: Map, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-[#FDFBF7] min-h-screen font-jost">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display text-black-deep mb-2 italic">Platform Analysis</h1>
          <p className="text-secondary/60 text-sm font-medium uppercase tracking-widest">In-depth market data and projections</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gold/10 text-black-deep rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-md transition-all">
                <Filter size={14} /> Filter Data
            </button>
            <button className="px-6 py-3 bg-black-deep text-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
                Export BI
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gold/10 shadow-sm">
            <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6`}>
              <m.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 opacity-50">{m.label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-display font-bold text-black-deep">{m.value}</h3>
                <div className="flex items-center text-emerald-500 text-[10px] font-black mb-1">
                    <ArrowUpRight size={14} /> +5.4%
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-gold/10 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-display italic text-black-deep">Regional Distribution</h3>
                <BarChart3 className="text-gold opacity-40" size={20} />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-20">
                    <PieChart size={120} strokeWidth={1} className="mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em]">Regional data visualization</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gold/10 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-display italic text-black-deep">Growth Projections</h3>
                <LineChart className="text-gold opacity-40" size={20} />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-20">
                    <Activity size={120} strokeWidth={1} className="mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-[0.2em]">Predictive analytics engine</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
