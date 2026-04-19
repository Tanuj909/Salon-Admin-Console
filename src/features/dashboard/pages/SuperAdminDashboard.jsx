import React from 'react';
import { 
  Users, 
  Store, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  ShieldCheck,
  Globe,
  Bell,
  Map,
  PieChart,
  AlertCircle,
  Zap,
  Activity,
  FileText
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "₹24,85,000", change: "+12.5%", trending: "up", icon: DollarSign, color: "bg-emerald-500" },
    { label: "Active Salons", value: "1,284", change: "+4.2%", trending: "up", icon: Store, color: "bg-blue-500" },
    { label: "Pending Salons", value: "12", change: "+3", trending: "up", icon: Clock, color: "bg-amber-500" },
    { label: "Total Users", value: "48,502", change: "+18.3%", trending: "up", icon: Users, color: "bg-purple-500" },
    { label: "Avg. Ticket", value: "₹850", change: "-2.1%", trending: "down", icon: TrendingUp, color: "bg-slate-500" },
  ];

  const recentSalons = [
    { name: "Luxe Artistry", city: "Mumbai", status: "PENDING", time: "2 mins ago" },
    { name: "The Velvet Chair", city: "Delhi", status: "VERIFIED", time: "45 mins ago" },
    { name: "Glow & Go", city: "Bangalore", status: "PENDING", time: "2 hours ago" },
    { name: "Elite Cuts", city: "Pune", status: "VERIFIED", time: "5 hours ago" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-[#FDFBF7] min-h-screen font-jost">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display text-black-deep mb-2 italic">Platform Overview</h1>
          <p className="text-secondary/60 text-sm font-medium uppercase tracking-widest">Global metrics and monitoring center</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                    </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-black-deep flex items-center justify-center text-[10px] font-bold text-gold">
                    +12
                </div>
            </div>
            <button className="px-6 py-3 bg-black-deep text-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all active:scale-95">
                Generate Report
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110`}></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center text-current transition-transform group-hover:scale-110`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${stat.trending === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trending === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 opacity-50">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold text-black-deep">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart Card (Static representation) */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gold/10 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-xl font-display italic text-black-deep">Global Growth Trend</h3>
                <p className="text-xs text-secondary opacity-50">Monthly active users vs Salon registration</p>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-secondary border border-slate-100">7D</button>
                <button className="px-3 py-1.5 rounded-lg bg-black-deep text-[9px] font-bold uppercase tracking-widest text-gold">30D</button>
            </div>
          </div>

          <div className="flex-1 flex items-end gap-3 h-64 px-2">
            {[45, 62, 55, 78, 90, 82, 95, 110, 105, 120, 140, 135].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full relative">
                    <div 
                        style={{ height: `${h}px` }} 
                        className="w-full bg-slate-100 rounded-t-xl group-hover:bg-gold/20 transition-all relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gold opacity-0 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                </div>
                <span className="text-[8px] font-bold text-secondary opacity-30 group-hover:opacity-100 transition-opacity">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Salons</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Users</span>
                </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-1 hover:gap-2 transition-all">
                Full Analysis <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Side Panel: Recent Actions */}
        <div className="bg-black-deep rounded-[32px] p-8 text-white flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-[0.03] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 mb-8">
            <h3 className="text-xl font-display italic text-gold">Latest Verified</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Activity from the last 24h</p>
          </div>

          <div className="space-y-6 relative z-10 flex-1">
            {recentSalons.map((salon, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 transition-colors group-hover:border-gold/50 ${salon.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {salon.status === 'VERIFIED' ? <ShieldCheck size={18} /> : <Clock size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm truncate group-hover:text-gold transition-colors">{salon.name}</p>
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter whitespace-nowrap">{salon.time}</span>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{salon.city} • {salon.status}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all relative z-10">
            View All Pending
          </button>
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. City Performance Leaderboard */}
        <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Top Performing Cities</h3>
            <Map size={18} className="text-gold" />
          </div>
          <div className="space-y-5 flex-1">
            {[
              { city: "Mumbai", salons: 420, revenue: "₹8.4L", growth: "+15%" },
              { city: "Delhi", salons: 385, revenue: "₹7.2L", growth: "+12%" },
              { city: "Bangalore", salons: 290, revenue: "₹6.1L", growth: "+18%" },
              { city: "Pune", salons: 150, revenue: "₹3.4L", growth: "+8%" },
            ].map((city, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFBF7] border border-gold/5 group hover:border-gold/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black-deep text-gold flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black-deep">{city.city}</p>
                    <p className="text-[10px] text-secondary opacity-50 uppercase tracking-widest">{city.salons} Salons</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-black-deep">{city.revenue}</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase">{city.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Revenue by Category (Pie Chart Representation) */}
        <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Revenue by Category</h3>
            <PieChart size={18} className="text-gold" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
             {/* Mock Pie Chart UI */}
             <div className="relative w-40 h-40 mb-8">
                <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 clip-path-polygon-[0%_0%,100%_0%,100%_50%,0%_50%]"></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-gold rotate-90 clip-path-polygon-[0%_0%,100%_0%,100%_30%,0%_30%]"></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-purple-500 rotate-180 clip-path-polygon-[0%_0%,100%_0%,100%_40%,0%_40%]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black uppercase text-secondary">Global</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 w-full">
                {[
                    { label: "Hair Care", value: "45%", color: "bg-emerald-500" },
                    { label: "Skin Care", value: "30%", color: "bg-gold" },
                    { label: "Nail Art", value: "15%", color: "bg-purple-500" },
                    { label: "Others", value: "10%", color: "bg-slate-200" },
                ].map(cat => (
                    <div key={cat.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{cat.label}</span>
                        <span className="ml-auto text-[10px] font-black text-black-deep">{cat.value}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. Revenue by Salon Leaderboard */}
        <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Revenue by Salon</h3>
            <DollarSign size={18} className="text-gold" />
          </div>
          <div className="space-y-4 flex-1">
            {[
              { name: "Luxe Artistry", revenue: "₹2.4L", bookings: 142, trend: "up" },
              { name: "The Velvet Chair", revenue: "₹1.8L", bookings: 98, trend: "up" },
              { name: "Elite Cuts", revenue: "₹1.5L", bookings: 120, trend: "down" },
              { name: "Glow & Go", revenue: "₹1.2L", bookings: 85, trend: "up" },
            ].map((salon, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-gold/20 transition-all group">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                        {i + 1}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-black-deep">{salon.name}</p>
                        <p className="text-[10px] text-secondary opacity-50 uppercase tracking-widest">{salon.bookings} Bookings</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-sm text-black-deep">{salon.revenue}</p>
                    <div className={`flex items-center justify-end gap-1 text-[9px] font-black ${salon.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {salon.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {salon.trend === 'up' ? 'Hot' : 'Stable'}
                    </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 bg-[#FDFBF7] border border-gold/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black-deep transition-all">
            Full Financials
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Live Platform Activity */}
        <div className="bg-white rounded-[40px] border border-gold/10 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-xl font-display italic text-black-deep">Live Platform Activity</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">482 Users Online</span>
                </div>
            </div>
            <Activity size={20} className="text-gold" />
          </div>
          
          <div className="space-y-6">
            {[
              { user: "Admin (Salon X)", action: "Updated Price List", time: "Just now", icon: "💰" },
              { user: "Customer (User 28)", action: "Booked Appointment", time: "1m ago", icon: "📅" },
              { user: "Staff (Member 05)", action: "Marked Available", time: "3m ago", icon: "✨" },
              { user: "Super Admin", action: "System Backup", time: "10m ago", icon: "🛡️" },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner">
                  {act.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-black-deep">
                    <span className="font-bold">{act.user}</span> {act.action}
                  </p>
                  <p className="text-[10px] text-secondary opacity-40 font-bold uppercase tracking-widest">{act.time}</p>
                </div>
                <ChevronRight size={14} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* 5. Recently Uploaded Documents */}
        <div className="bg-white rounded-[40px] border border-gold/10 shadow-sm p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display italic text-black-deep">Recently Uploaded Documents</h3>
                <FileText size={20} className="text-gold" />
            </div>
            <div className="space-y-4 flex-1">
                {[
                    { salon: "Luxe Artistry", docType: "Trade License", time: "10 mins ago", size: "2.4 MB" },
                    { salon: "The Velvet Chair", docType: "Pan Card", time: "25 mins ago", size: "1.1 MB" },
                    { salon: "Elite Cuts", docType: "Shop Establishment", time: "1 hour ago", size: "3.2 MB" },
                    { salon: "Glow & Go", docType: "GST Certificate", time: "3 hours ago", size: "1.8 MB" },
                ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-2xl border border-gold/5 hover:border-gold/20 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all">
                                <FileText size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-black-deep">{doc.docType}</p>
                                <p className="text-[10px] text-secondary opacity-50 uppercase tracking-widest">{doc.salon} • {doc.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-secondary opacity-30 uppercase mb-1">{doc.size}</p>
                            <button className="text-[9px] font-black uppercase text-gold hover:text-black-deep transition-colors">Review</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="mt-8 w-full py-4 bg-black-deep text-gold rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-lg transition-all active:scale-95">
                View Verification Center
            </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
