import React from 'react';
import { ClipboardList, Clock, Sparkles, UserPlus } from 'lucide-react';

const ReceptionistDashboard = () => {
  return (
    <div className="p-8 space-y-8 bg-[#FDFBF7] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-display text-slate-900 mb-2 italic">Receptionist Desk</h1>
        <p className="text-slate-500 text-lg">Managing front-desk operations and guest experiences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-4xl mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-6">
          <ClipboardList size={40} />
        </div>
        <h2 className="text-3xl font-display text-slate-900 mb-4 italic">Daily Operations Hub Coming Soon</h2>
        <p className="text-slate-500 text-lg leading-relaxed">
           The Receptionist dashboard is being optimized for quick check-ins, appointment scheduling, and customer management. You will soon have a dedicated view for daily walk-ins and active bookings.
        </p>
        
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Quick Booking", icon: UserPlus },
             { label: "Today's List", icon: ClipboardList },
             { label: "Waitlist", icon: Clock },
             { label: "Express Billing", icon: Sparkles },
           ].map((item, i) => (
             <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2">
               <item.icon size={20} className="text-purple-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
