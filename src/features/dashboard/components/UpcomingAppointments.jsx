import React from 'react';
import { Clock, Phone, MoreVertical, Scissors } from 'lucide-react';

const appointments = [
  { 
    time: "03:00 PM", 
    customer: "Suman Giri", 
    service: "Manicure",
    staff: "Priya V.",
    duration: "45 Min",
    status: "Confirmed",
    phone: "+91 9876543210"
  },
  { 
    time: "03:30 PM", 
    customer: "Karan Johar", 
    service: "Head Massage",
    staff: "Rahul K.",
    duration: "30 Min",
    status: "Arrived",
    phone: "+91 8765432109"
  },
  { 
    time: "04:15 PM", 
    customer: "Nisha Patel", 
    service: "Eyebrow Threading",
    staff: "Amit S.",
    duration: "15 Min",
    status: "Confirmed",
    phone: "+91 7654321098"
  },
  { 
    time: "05:00 PM", 
    customer: "Amit Trivedi", 
    service: "Full Body Spa",
    staff: "Priya V.",
    duration: "90 Min",
    status: "Pending",
    phone: "+91 6543210987"
  },
  { 
    time: "06:00 PM", 
    customer: "Sneha Reddy", 
    service: "Hair Coloring",
    staff: "Rahul K.",
    duration: "120 Min",
    status: "Confirmed",
    phone: "+91 5432109876"
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-700';
    case 'Arrived': return 'bg-amber-100 text-amber-700';
    case 'Pending': return 'bg-slate-100 text-slate-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const UpcomingAppointments = () => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-jost">Next 5 Appointments</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Today's Schedule</p>
        </div>
        <button className="text-indigo-600 font-bold text-xs hover:underline">View Calendar</button>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {appointments.map((apt, idx) => (
          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 group">
            {/* Time Block */}
            <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] bg-slate-50 rounded-xl text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
              <span className="text-lg font-black leading-none">{apt.time.split(' ')[0]}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{apt.time.split(' ')[1]}</span>
            </div>
            
            {/* Details Block */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate pr-2">{apt.customer}</p>
                  <p className="text-xs text-indigo-600 font-semibold truncate items-center flex gap-1 mt-0.5">
                    <Scissors size={10} /> {apt.service}
                  </p>
                </div>
                <button className="text-slate-300 hover:text-indigo-600 transition-colors shrink-0 p-1">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Meta info footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-600 font-bold">
                       {apt.staff.charAt(0)}
                    </div>
                    {apt.staff}
                  </div>
                  <span className="text-[10px] text-slate-300">|</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                    <Clock size={10} />
                    {apt.duration}
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded flex items-center justify-center text-[9px] font-bold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
