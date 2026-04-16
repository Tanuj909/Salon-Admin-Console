import React from 'react';

const methods = [
  { name: "UPI", percentage: 55, color: "bg-indigo-500" },
  { name: "Cash", percentage: 30, color: "bg-orange-400" },
  { name: "Card", percentage: 15, color: "bg-slate-400" },
];

const PaymentMethods = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6 font-jost">Payment Methods</h3>
      
      <div className="space-y-6">
        <div className="flex h-3 w-full rounded-full overflow-hidden mb-8">
          {methods.map((m, idx) => (
            <div 
              key={idx} 
              className={`${m.color} h-full transition-all duration-500`} 
              style={{ width: `${m.percentage}%` }}
              title={`${m.name}: ${m.percentage}%`}
            ></div>
          ))}
        </div>

        <div className="space-y-4">
          {methods.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${m.color}`}></div>
                <span className="text-sm font-medium text-slate-600">{m.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{m.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
