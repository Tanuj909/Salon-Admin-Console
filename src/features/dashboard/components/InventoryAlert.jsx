import React from 'react';
import { AlertTriangle } from 'lucide-react';

const lowStockItems = [
  { name: "Hair Smoothing Cream", stock: 2, unit: "pcs" },
  { name: "Organic Face Scrub", stock: 5, unit: "pcs" },
  { name: "Global Color Shade #4", stock: 1, unit: "box" },
];

const InventoryAlert = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 font-jost">Low Stock Alerts</h3>
        <AlertTriangle className="text-orange-500" size={20} />
      </div>
      
      <div className="space-y-4">
        {lowStockItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-orange-50 border border-orange-100 group">
            <div>
              <p className="text-sm font-bold text-slate-700">{item.name}</p>
              <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Action Required</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-600">{item.stock} {item.unit}</p>
              <p className="text-[10px] text-slate-400 font-medium">Remaining</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all">
        Open Inventory Manager
      </button>
    </div>
  );
};

export default InventoryAlert;
