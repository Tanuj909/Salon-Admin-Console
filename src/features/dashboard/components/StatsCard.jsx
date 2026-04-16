import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const isPositive = trend === 'up';
  
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    gold: "bg-gold/10 text-gold",
  };

  return (
    <div className="bg-white p-4 rounded-[18px] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={18} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendValue}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium mb-0.5 font-jost">{title}</p>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
