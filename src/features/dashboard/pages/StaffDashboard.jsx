import React from 'react';
import { 
  Clock, 
  Calendar, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  User,
  Scissors,
  Award,
  ArrowRight
} from 'lucide-react';

const StaffDashboard = () => {
  const stats = [
    { label: "Today's Bookings", value: "8", icon: Calendar, color: "bg-blue-500" },
    { label: "Hours Worked", value: "6.5h", icon: Clock, color: "bg-amber-500" },
    { label: "Average Rating", value: "4.9", icon: Star, color: "bg-gold" },
    { label: "Completion Rate", value: "100%", icon: CheckCircle2, color: "bg-emerald-500" },
  ];

  const upcomingBookings = [
    { customer: "Priya Sharma", service: "Premium Haircut", time: "02:30 PM", type: "Confirm" },
    { customer: "Rahul Verma", service: "Beard Styling", time: "04:00 PM", type: "Pending" },
    { customer: "Anita Singh", service: "Hair Spa", time: "05:30 PM", type: "Confirm" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FDFBF7] min-h-screen font-jost">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display text-black-deep mb-2 italic">My Daily Overview</h1>
          <p className="text-secondary/60 text-sm font-medium uppercase tracking-widest">Tracking your performance and schedule</p>
        </div>
        <div className="px-5 py-3 bg-white border border-gold/10 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Award size={20} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Current Status</p>
                <p className="text-sm font-bold text-black-deep flex items-center gap-2">
                    Top Performer <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </p>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
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
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gold/10 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Today's Schedule</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-black-deep transition-colors">View Full Calendar</button>
          </div>

          <div className="space-y-4">
            {upcomingBookings.map((booking, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#FDFBF7] border border-gold/5 hover:border-gold/20 transition-all gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gold/10 flex items-center justify-center text-secondary">
                        <Scissors size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-black-deep">{booking.customer}</p>
                        <p className="text-[10px] text-secondary opacity-60 uppercase tracking-widest">{booking.service}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                        <p className="text-sm font-bold text-black-deep">{booking.time}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">{booking.type}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-black-deep text-gold flex items-center justify-center hover:bg-gold hover:text-black-deep transition-all">
                        <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Card */}
        <div className="bg-black-deep rounded-[32px] p-8 text-white flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold opacity-[0.03] rounded-full -mr-24 -mt-24"></div>
          
          <h3 className="text-xl font-display italic text-gold mb-8">Weekly Progress</h3>
          
          <div className="space-y-8 relative z-10 flex-1">
             <div>
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Target Bookings</span>
                    <span className="text-[10px] font-bold text-gold uppercase">42 / 50</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[84%] rounded-full shadow-[0_0_10px_rgba(200,169,81,0.5)]"></div>
                </div>
             </div>

             <div>
                <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Customer Satisfaction</span>
                    <span className="text-[10px] font-bold text-gold uppercase">98%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[98%] rounded-full shadow-[0_0_10px_rgba(200,169,81,0.5)]"></div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Earnings This Week</p>
                <h4 className="text-3xl font-display font-bold text-white">₹12,450</h4>
                <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> +₹1,200 from last week
                </p>
             </div>
          </div>

          <button className="w-full py-4 mt-8 bg-gold text-black-deep rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black-deep transition-all font-bold">
            View My Reviews
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
              { title: "Manage Schedule", desc: "Update your availability", icon: Calendar },
              { title: "Service Portfolio", desc: "View your assigned services", icon: Scissors },
              { title: "My Profile", desc: "Update work details", icon: User },
          ].map((action, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-black-deep group-hover:bg-gold group-hover:text-black-deep transition-all">
                      <action.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                      <h4 className="font-bold text-sm text-black-deep">{action.title}</h4>
                      <p className="text-xs text-secondary opacity-60">{action.desc}</p>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
