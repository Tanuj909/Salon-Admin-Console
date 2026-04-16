import React from 'react';
import { LayoutGrid, Globe, ShieldCheck, Users } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <div className="p-8 space-y-8 bg-[#FDFBF7] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-display text-slate-900 mb-2 italic">Super Admin Control Hub</h1>
        <p className="text-slate-500 text-lg">Managing the global salon network and platform security.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-display text-slate-900 mb-4 italic">Global Analytics Coming Soon</h2>
        <p className="text-slate-500 text-lg leading-relaxed">
           The Super Admin dashboard is currently under development. Soon you will be able to track performance across all verified salons, manage platform-wide categories, and monitor administrative activities.
        </p>
        
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Global Revenue", icon: Globe },
             { label: "Salon Metrics", icon: LayoutGrid },
             { label: "User Management", icon: Users },
             { label: "Security Logs", icon: ShieldCheck },
           ].map((item, i) => (
             <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2">
               <item.icon size={20} className="text-indigo-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
