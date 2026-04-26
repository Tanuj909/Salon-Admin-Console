import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowUpRight,
  Zap,
  Target,
  Award,
  Users2,
  Clock,
  UserCheck,
  ShoppingBag
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useAuth } from "@/hooks/useAuth";
import dashboardService from "@/services/dashboardService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [range, setRange] = useState("LAST_30_DAYS");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const businessId = user?.businessId || user?.business?.id;

  useEffect(() => {
    if (businessId) {
      fetchDashboardData();
    }
  }, [range, businessId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardService.getFullDashboard(range, businessId);
      setData(dashboardData);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = useMemo(() => {
    if (!data?.kpiCards) return [];
    
    return [
      { 
        label: "Total Revenue", 
        value: `AED ${data.kpiCards.totalRevenue?.toLocaleString()}`, 
        growth: data.kpiCards.revenueGrowth, 
        icon: DollarSign, 
        color: "emerald"
      },
      { 
        label: "Total Bookings", 
        value: data.kpiCards.totalBookings, 
        growth: data.kpiCards.bookingsGrowth, 
        icon: Calendar, 
        color: "blue"
      },
      { 
        label: "Active Customers", 
        value: data.kpiCards.activeCustomers, 
        growth: data.kpiCards.customerGrowth, 
        icon: Users, 
        color: "purple"
      },
      { 
        label: "Completion Rate", 
        value: `${data.kpiCards.completionRate}%`, 
        sub: `${data.kpiCards.completedBookings} Done`, 
        icon: CheckCircle2, 
        color: "amber"
      },
    ];
  }, [data]);

  const secondaryKpis = useMemo(() => {
    if (!data?.kpiCards) return [];
    return [
      { label: "Avg Booking Value", value: `AED ${data.kpiCards.averageBookingValue}`, icon: ShoppingBag },
      { label: "Pending Bookings", value: data.kpiCards.pendingBookings, icon: Clock },
      { label: "Confirmed Bookings", value: data.kpiCards.confirmedBookings, icon: UserCheck },
      { label: "Staff Count", value: data.kpiCards.staffCount, icon: Users2 },
      { label: "Average Rating", value: data.kpiCards.averageRating, icon: Star },
    ];
  }, [data]);

  if (loading && !data) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[80vh] bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#C5A358', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-jost pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black-deep rounded-xl flex items-center justify-center text-gold shadow-lg">
              <Zap size={16} fill="currentColor" />
            </div>
            <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.4em]">Management Terminal</p>
          </div>
          <h1 className="text-4xl font-display text-black-deep italic tracking-tight">Admin Insights</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
            {[
              { id: "LAST_7_DAYS", label: "7D" },
              { id: "LAST_30_DAYS", label: "30D" },
              { id: "LAST_90_DAYS", label: "90D" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  range === p.id 
                    ? 'bg-black-deep text-gold shadow-lg' 
                    : 'text-secondary/40 hover:text-black-deep hover:bg-gold/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-gold/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 shadow-sm group-hover:rotate-6 transition-transform`}>
                  <card.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em]">{card.label}</span>
                  {card.growth !== undefined && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 flex items-center gap-1 ${
                      card.growth >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
                    }`}>
                      {card.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {Math.abs(card.growth)}%
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold text-black-deep mb-1">{card.value}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-[8px] font-bold text-secondary/40 uppercase tracking-widest">{card.sub || 'Current Period'}</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Matrix */}
        <div className="lg:col-span-2 bg-white rounded-[48px] border border-gold/5 shadow-sm p-10 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-display italic text-black-deep">Revenue Flow</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Daily transactional metrics</p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueChart?.points || []}>
                <defs>
                  <linearGradient id="colorRevAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A358" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C5A358" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C5A358" strokeWidth={3} fillOpacity={1} fill="url(#colorRevAdmin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operations Pulse */}
        <div className="bg-black-deep rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-gold opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
             <h4 className="text-xl font-display italic text-gold mb-8 relative z-10">Operations Pulse</h4>
             <div className="space-y-6 relative z-10">
                {secondaryKpis.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-default group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover/item:scale-110 transition-transform">
                        <item.icon size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                    </div>
                    <span className="text-lg font-display font-bold text-white group-hover/item:text-gold transition-colors">{item.value}</span>
                  </div>
                ))}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Services */}
        <div className="bg-white rounded-[48px] border border-gold/5 shadow-sm p-10 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-display italic text-black-deep">Top Services</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">By revenue and booking volume</p>
            </div>
            <Target className="text-gold" size={24} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-4">
              {(data?.topServices?.byRevenue || []).map((service, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gold/10 flex items-center justify-center text-black-deep font-display font-bold text-xl shadow-sm group-hover:rotate-6 transition-transform">
                      {service.serviceName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-black-deep mb-1 group-hover:text-gold transition-colors">{service.serviceName}</h5>
                      <p className="text-[9px] font-black text-secondary/40 uppercase tracking-widest">{service.bookingCount} Bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-black-deep">AED {service.revenue?.toLocaleString()}</p>
                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gold" style={{ width: `${service.percentageOfTotal}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-black-deep rounded-[48px] p-10 text-white shadow-2xl flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-display italic text-gold">Staff Performance</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">Team efficiency Leaderboard</p>
            </div>
            <TrendingUp className="text-gold opacity-50" size={24} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-4">
              {(data?.staffPerformance?.topPerformers || []).map((staff, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all group border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-black-deep font-bold text-xs ring-4 ring-gold/10 overflow-hidden">
                      {staff.staffName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white group-hover:text-gold transition-colors">{staff.staffName}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-white/40">{staff.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-gold">AED {staff.revenue?.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">{staff.completedBookings} Done</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-[48px] border border-gold/5 shadow-sm p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-display italic text-black-deep">Customer Insights</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Retention and acquisition patterns</p>
          </div>
          <Users2 className="text-gold" size={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 bg-slate-50/50 rounded-3xl">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Retention Rate</p>
            <h4 className="text-3xl font-display font-bold text-black-deep">{data?.customerInsights?.customerRetentionRate}%</h4>
          </div>
          <div className="p-6 bg-slate-50/50 rounded-3xl">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Repeat Customers</p>
            <h4 className="text-3xl font-display font-bold text-black-deep">{data?.customerInsights?.repeatCustomers}</h4>
          </div>
          <div className="p-6 bg-slate-50/50 rounded-3xl">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">New Customers</p>
            <h4 className="text-3xl font-display font-bold text-black-deep">{data?.customerInsights?.newCustomers}</h4>
          </div>
          <div className="p-6 bg-slate-50/50 rounded-3xl">
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2">Total Customers</p>
            <h4 className="text-3xl font-display font-bold text-black-deep">{data?.customerInsights?.totalCustomers}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
