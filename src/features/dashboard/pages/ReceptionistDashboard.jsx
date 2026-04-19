import React from 'react';
import { 
  Users, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  PlusCircle, 
  Search,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Star,
  Coffee,
  IndianRupee,
  UserCheck
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const stats = [
    { label: "Today's Check-ins", value: "24", icon: Users, color: "bg-blue-500" },
    { label: "Pending Payments", value: "5", icon: AlertCircle, color: "bg-red-500" },
    { label: "Staff Available", value: "12 / 15", icon: CheckCircle2, color: "bg-emerald-500" },
    { label: "Est. Revenue", value: "₹18,500", icon: TrendingUp, color: "bg-gold" },
  ];

  const liveQueue = [
    { name: "Ananya Kapoor", service: "Facial + Waxing", time: "Arriving in 5m", status: "In Transit" },
    { name: "Vikram Malhotra", service: "Men's Styling", time: "Due Now", status: "Delayed" },
    { name: "Sanya Gupta", service: "Nail Extension", time: "12:15 PM", status: "Upcoming" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FDFBF7] min-h-screen font-jost">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display text-black-deep mb-2 italic">Receptionist Command Center</h1>
          <p className="text-secondary/60 text-sm font-medium uppercase tracking-widest">Managing guest flow and daily operations</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gold/10 text-black-deep rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-md transition-all">
                <Search size={14} /> Find Booking
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-black-deep text-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
                <PlusCircle size={14} /> New Appointment
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`}></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center text-current`}>
                    <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">{stat.label}</p>
                    <h3 className="text-2xl font-display font-bold text-black-deep">{stat.value}</h3>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Customer Queue */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gold/10 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-display italic text-black-deep">Live Arrival Queue</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded animate-pulse">Live</span>
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-black-deep transition-colors">Manage All</button>
          </div>

          <div className="space-y-4">
            {liveQueue.map((guest, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#FDFBF7] border border-gold/5 hover:border-gold/20 transition-all gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gold/10 flex items-center justify-center text-secondary">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-black-deep">{guest.name}</p>
                        <p className="text-[10px] text-secondary opacity-60 uppercase tracking-widest">{guest.service}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-8">
                    <div className="text-right">
                        <p className="text-sm font-bold text-black-deep">{guest.time}</p>
                        <span className={`text-[9px] font-black uppercase ${guest.status === 'Delayed' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {guest.status}
                        </span>
                    </div>
                    <button className="px-4 py-2 bg-black-deep text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                        Check In
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Operations Detail */}
        <div className="space-y-8">
            {/* 1. Today's Financial Summary */}
            <div className="bg-black-deep rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold opacity-[0.05] rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-lg font-display italic text-gold">Today's Revenue</h3>
                    <IndianRupee size={18} className="text-gold" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-3xl font-display font-bold text-white mb-1">₹18,500</h4>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp size={12} /> +12% from yesterday
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Services</p>
                            <p className="text-xs font-bold text-white">₹14,200</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Products</p>
                            <p className="text-xs font-bold text-white">₹4,300</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Staff Status Summary */}
            <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-black-deep uppercase tracking-widest">Staff Status</h3>
                    <UserCheck size={16} className="text-gold" />
                </div>
                <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Available Now</span>
                        <span className="text-xs font-black text-emerald-700">12</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                                <Coffee size={12} /> On Leave Today
                            </span>
                            <span className="text-xs font-black text-amber-700">3</span>
                        </div>
                        <div className="flex -space-x-2">
                            {['R', 'K', 'M'].map((l, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white border border-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-700">
                                    {l}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Recent Reviews */}
            <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-black-deep uppercase tracking-widest">Recent Feedback</h3>
                    <Star size={16} className="text-gold fill-gold" />
                </div>
                <div className="space-y-4">
                    {[
                        { name: "Pooja D.", rating: 5, text: "Amazing service by Kunal!" },
                        { name: "Aman R.", rating: 4, text: "Great styling, timely check-in." },
                    ].map((rev, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-[#FDFBF7] border border-gold/5">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] font-bold text-black-deep">{rev.name}</p>
                                <div className="flex">
                                    {[...Array(rev.rating)].map((_, j) => <Star key={j} size={8} className="fill-gold text-gold" />)}
                                </div>
                            </div>
                            <p className="text-[10px] text-secondary opacity-60 leading-tight italic">"{rev.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Staff Availability Quick View */}
      <div className="bg-white p-8 rounded-[40px] border border-gold/10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Staff Availability Overview</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-50">Filter by Specialty</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
                { name: "Rohan", status: "Active", service: "Hair" },
                { name: "Sania", status: "Busy", service: "Nails" },
                { name: "Kunal", status: "Active", service: "Skin" },
                { name: "Meera", status: "Break", service: "Hair" },
                { name: "Ishaan", status: "Active", service: "Style" },
                { name: "Zoya", status: "Active", service: "Skin" },
            ].map((staff, i) => (
                <div key={i} className="p-4 rounded-2xl border border-[#FDFBF7] bg-[#FDFBF7] flex flex-col items-center gap-2 text-center group hover:bg-white hover:border-gold/20 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black-deep border border-gold/10 group-hover:bg-black-deep group-hover:text-gold transition-all">
                        {staff.name[0]}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-black-deep">{staff.name}</p>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className={`w-1 h-1 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' : staff.status === 'Busy' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                            <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">{staff.status}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
