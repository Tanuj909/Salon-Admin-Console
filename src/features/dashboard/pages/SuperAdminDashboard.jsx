import React, { useState, useEffect } from 'react';
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
  PieChart as PieChartIcon,
  AlertCircle,
  Zap,
  Activity,
  FileText,
  Star,
  Calendar,
  Eye
} from 'lucide-react';
import {
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
  AreaChart,
  Area
} from 'recharts';
import superAdminDashboardService from '@/services/superAdminDashboardService';

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState('DAILY'); // DAILY, MONTHLY, YEARLY
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [visits, setVisits] = useState([]);
  const [revenueByCity, setRevenueByCity] = useState([]);
  const [revenueByState, setRevenueByState] = useState([]);
  const [topSalons, setTopSalons] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, salons, revenue, regions
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [revenuePeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      // Get current week number (ISO)
      const getISOWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      };
      const week = getISOWeek(today);

      const results = await Promise.allSettled([
        superAdminDashboardService.getStats(),
        revenuePeriod === 'DAILY' 
          ? superAdminDashboardService.getDailyRevenue(startDate, endDate)
          : revenuePeriod === 'MONTHLY'
          ? superAdminDashboardService.getMonthlyRevenue(year, month)
          : superAdminDashboardService.getYearlyRevenue(year),
        superAdminDashboardService.getTopBusinesses(10),
        superAdminDashboardService.getVisitsBySalon(startDate, endDate),
        superAdminDashboardService.getRevenueByCity(),
        superAdminDashboardService.getRevenueByState(),
        superAdminDashboardService.getTopSalons('MONTH', endDate, 10, 'revenue'),
        superAdminDashboardService.getRevenueSummary(startDate, endDate)
      ]);

      if (results[0].status === 'fulfilled') setStats(results[0].value);
      if (results[1].status === 'fulfilled') setRevenueData(results[1].value);
      if (results[2].status === 'fulfilled') setTopBusinesses(results[2].value);
      if (results[3].status === 'fulfilled') setVisits(results[3].value);
      if (results[4].status === 'fulfilled') setRevenueByCity(results[4].value);
      if (results[5].status === 'fulfilled') setRevenueByState(results[5].value);
      if (results[6].status === 'fulfilled') setTopSalons(results[6].value);
      if (results[7].status === 'fulfilled') setRevenueSummary(results[7].value);

      if (results.some(r => r.status === 'rejected')) {
        const rejectedItems = results.filter(r => r.status === 'rejected').map(r => r.reason?.message || "Unknown error");
        console.warn("Some metrics failed to load:", rejectedItems);
        setError("Some data points could not be loaded. Please check back later.");
      }
      
    } catch (err) {
      console.error("Critical error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          <p className="text-secondary font-display italic animate-pulse">Initializing Platform Intelligence...</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    { 
      label: "Total Revenue", 
      value: `AED ${(stats?.totalRevenue || 0).toLocaleString()}`, 
      sub: `${stats?.totalBookings || 0} Bookings`, 
      icon: DollarSign, 
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+12.5%" 
    },
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      sub: `${stats?.totalCustomers || 0} Customers`, 
      icon: Users, 
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+8.2%"
    },
    { 
      label: "Total Businesses", 
      value: stats?.totalBusinesses || 0, 
      sub: `${stats?.verifiedBusinesses || 0} Verified`, 
      icon: Store, 
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+4.1%"
    },
    { 
      label: "Average Rating", 
      value: stats?.averageRating?.toFixed(1) || "0.0", 
      sub: `${stats?.totalReviews || 0} Reviews`, 
      icon: Star, 
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Stable"
    },
  ];

  const userBreakdown = [
    { label: "Total Customers", value: stats?.totalCustomers || 0, icon: Users, color: "bg-blue-500" },
    { label: "Total Staff", value: stats?.totalStaff || 0, icon: ShieldCheck, color: "bg-indigo-500" },
    { label: "Total Admins", value: stats?.totalAdmins || 0, icon: Bell, color: "bg-violet-500" },
  ];

  const businessBreakdown = [
    { label: "Verified Businesses", value: stats?.verifiedBusinesses || 0, icon: ShieldCheck, color: "bg-emerald-500" },
    { label: "Pending Businesses", value: stats?.pendingBusinesses || 0, icon: Clock, color: "bg-amber-500" },
  ];

  const complaintStats = [
    { label: "Total Complaints", value: stats?.totalComplaints || 0, icon: AlertCircle, color: "bg-red-500" },
    { label: "Pending Complaints", value: stats?.pendingComplaints || 0, icon: Activity, color: "bg-orange-500" },
  ];

  const trendData = revenueSummary?.dailyBreakdown?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    revenue: item.revenue || 0,
    transactions: item.transactionCount || 0,
    bookings: stats?.bookingsPerDay?.[item.date] || 0
  })) || [];

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-jost pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-black-deep rounded-xl flex items-center justify-center text-gold shadow-lg">
              <Zap size={16} fill="currentColor" />
            </div>
            <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.4em]">SuperAdmin Dashboard</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {error && (
              <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-red-600 shadow-sm animate-pulse w-full md:w-auto">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gold/10 shadow-inner gap-1 w-full md:w-auto">
                {['overview', 'salons', 'revenue', 'regions'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 w-full ${activeTab === tab ? 'bg-black-deep text-gold shadow-xl scale-105' : 'text-secondary/40 hover:text-secondary hover:bg-gold/5'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[32px] border border-gold/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm group-hover:rotate-6 transition-transform`}>
                      <stat.icon size={20} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em]">{stat.label}</span>
                      <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">{stat.trend}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-black-deep mb-1">{stat.value}</h3>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-[8px] font-bold text-secondary/40 uppercase tracking-widest">{stat.sub}</span>
                    <ArrowUpRight size={12} className={stat.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[48px] border border-gold/5 shadow-sm p-10 min-h-[500px] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-display italic text-black-deep mb-1">Growth Matrix</h3>
                  <p className="text-[10px] text-secondary/40 font-black uppercase tracking-[0.2em]">Platform revenue & booking velocity</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {['DAILY', 'MONTHLY', 'YEARLY'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setRevenuePeriod(p)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${revenuePeriod === p ? 'bg-white text-black-deep shadow-sm' : 'text-secondary/30 hover:text-secondary'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full min-h-[350px]">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A358" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C5A358" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)', padding: '20px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }} itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue (AED )" stroke="#C5A358" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="transactions" name="Transactions" stroke="#10b981" strokeWidth={4} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-gold/10">
                    <Activity className="text-gold/20 mb-4" size={48} />
                    <p className="text-secondary/20 font-display italic text-xl tracking-wider">Awaiting Data Stream...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-black-deep rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                <h4 className="text-xl font-display italic text-gold mb-8 relative z-10">Users Breakdown</h4>
                <div className="space-y-6 relative z-10">
                  {userBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${item.color} bg-opacity-20 flex items-center justify-center text-current`}>
                          <item.icon size={18} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{item.label}</span>
                      </div>
                      <span className="text-xl font-bold font-display">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-gold/5 shadow-sm">
                <h4 className="text-xl font-display italic text-black-deep mb-8">System Pulse</h4>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Business Health</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">{((stats?.verifiedBusinesses / stats?.totalBusinesses) * 100).toFixed(1)}% Verified Businesses</span>
                    </div>
                    <div className="flex gap-2 h-2.5">
                        <div className="bg-emerald-500 rounded-full h-full" style={{ width: `${(stats?.verifiedBusinesses / stats?.totalBusinesses) * 100}%` }}></div>
                        <div className="bg-amber-400 rounded-full h-full" style={{ width: `${(stats?.pendingBusinesses / stats?.totalBusinesses) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">Complaints</span>
                        <span className="text-[10px] font-black text-red-500 uppercase">{stats?.pendingComplaints || 0} Pending Complaints</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {complaintStats.map((c, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-gold/20 transition-all">
                                <p className="text-[8px] font-black text-secondary/30 uppercase tracking-widest mb-1">{c.label}</p>
                                <p className="text-lg font-bold text-black-deep">{c.value}</p>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salons' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-black-deep rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 text-white shadow-2xl flex flex-col h-auto max-h-[500px] lg:max-h-none lg:h-[700px]">
                <div className="flex items-center justify-between mb-6 lg:mb-10">
                  <div>
                    <h3 className="text-2xl font-display italic text-gold">Top Businesses</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">Revenue Leaderboard</p>
                  </div>
                  <TrendingUp className="text-gold opacity-50" size={24} />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                  {topBusinesses.map((biz, i) => (
                    <div key={i} className="flex items-center gap-5 group p-4 rounded-3xl hover:bg-white/5 border border-transparent hover:border-gold/10 transition-all duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-black text-sm shrink-0 shadow-inner group-hover:bg-gold group-hover:text-black-deep transition-all">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-bold text-sm truncate group-hover:text-gold transition-colors">{biz.name}</p>
                          <p className="text-sm font-black text-emerald-400">AED {(biz.revenue || 0).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{biz.bookingCount} Bookings</span>
                              <div className="flex items-center gap-1 text-[9px] font-bold text-gold">
                                <Star size={10} fill="currentColor" /> {biz.averageRating?.toFixed(1)}
                              </div>
                           </div>
                           <ArrowUpRight size={12} className="text-white/20 group-hover:text-gold transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-[32px] lg:rounded-[48px] border border-gold/5 shadow-sm p-6 lg:p-10 flex flex-col h-auto lg:h-[700px]">
                <div className="flex items-center justify-between mb-6 lg:mb-10">
                   <div>
                    <h3 className="text-2xl font-display italic text-black-deep">Advanced Analytics</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Deep-dive salon performance</p>
                  </div>
                  <FileText className="text-gold" size={24} />
                </div>
                <div className="flex-1 overflow-hidden border border-slate-100 rounded-3xl">
                  <div className="overflow-x-auto h-full custom-scrollbar hidden lg:block">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 z-10">
                        <tr>
                          {['Salon', 'Location', 'Completion', 'Rating', 'Revenue'].map((h, i) => (
                            <th key={i} className="px-6 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest border-b border-slate-100">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {topSalons.map((salon, i) => (
                          <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-black-deep text-gold flex items-center justify-center font-black text-[10px] shadow-md">
                                  {salon.businessName.charAt(0)}
                                </div>
                                <span className="font-bold text-xs text-black-deep group-hover:text-gold transition-colors">{salon.businessName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-[10px] font-bold text-secondary/60">
                              <div className="flex flex-col">
                                <span>{salon.city}</span>
                                <span className="opacity-50">{salon.state}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex flex-col gap-1.5">
                                  <span className="text-[10px] font-black text-black-deep">{salon.completedBookings} Completed</span>
                                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                <Star size={14} fill="currentColor" /> {salon.averageRating.toFixed(1)}
                              </div>
                            </td>
                            <td className="px-6 py-6 text-xs font-black text-black-deep">
                              AED {salon.revenue?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARD VIEW */}
                  <div className="lg:hidden divide-y divide-slate-50 overflow-y-auto max-h-[400px] custom-scrollbar">
                    {topSalons.map((salon, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black-deep text-gold flex items-center justify-center font-black text-[10px] shadow-md shrink-0">
                            {salon.businessName.charAt(0)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[13px] text-black-deep truncate max-w-[150px] sm:max-w-[200px]">{salon.businessName}</span>
                            <span className="text-[10px] font-bold text-secondary/60">{salon.city}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedSalon(salon);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all shadow-sm shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-[40px] border border-gold/5 shadow-sm p-8 space-y-8">
                 <h4 className="text-xl font-display italic text-black-deep">Summary</h4>
                 <div className="space-y-6">
                    <div className="p-6 bg-[#FDFBF7] rounded-[32px] border border-gold/10">
                       <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2">Total Revenue</p>
                       <p className="text-3xl font-bold text-black-deep">AED {revenueSummary?.totalRevenue?.toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                       <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Total Transactions</p>
                       <p className="text-3xl font-bold text-emerald-600">{revenueSummary?.totalTransactions}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                       <p className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-2">Avg. Ticket Size</p>
                       <p className="text-3xl font-bold text-black-deep">AED {((revenueSummary?.totalRevenue || 0) / (revenueSummary?.totalTransactions || 1)).toFixed(0)}</p>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-3 bg-white rounded-[32px] lg:rounded-[48px] border border-gold/5 shadow-sm p-6 lg:p-10 flex flex-col h-[400px] lg:h-[600px] w-full overflow-hidden">
                 <div className="flex items-center justify-between mb-6 lg:mb-10">
                    <h3 className="text-2xl font-display italic text-black-deep">Daily Transaction Flow</h3>
                    <div className="flex items-center gap-3 text-[10px] font-black text-secondary/40 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold"></div> Revenue</span>
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Count</span>
                    </div>
                 </div>
                 <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[600px] h-[300px] lg:h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueSummary?.dailyBreakdown || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
                            <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(197, 163, 88, 0.05)' }} />
                            <Bar yAxisId="left" dataKey="revenue" name="Revenue (AED )" fill="#C5A358" radius={[6, 6, 0, 0]} barSize={20} />
                            <Bar yAxisId="right" dataKey="transactionCount" name="Orders" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'regions' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[48px] border border-gold/5 shadow-sm p-10 flex flex-col min-h-[600px]">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-display italic text-black-deep">City Insights</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Revenue distribution by city</p>
                    </div>
                    <Map className="text-gold" size={24} />
                 </div>
                 <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
                    {revenueByCity.map((city, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-black-deep group-hover:text-gold transition-colors">{city.regionName}</span>
                              <span className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">{city.uniqueSalons} Salons • {city.averageRating?.toFixed(1)} Rating</span>
                           </div>
                           <span className="text-sm font-black text-black-deep">AED {city.totalRevenue?.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-50 rounded-full border border-slate-100 overflow-hidden relative">
                           <div className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-1000 group-hover:brightness-110" style={{ width: `${Math.min(100, (city.totalRevenue / (stats?.totalRevenue || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-black-deep rounded-[48px] p-10 text-white shadow-2xl flex flex-col min-h-[600px]">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-display italic text-gold">State Analytics</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">Regional performance benchmarks</p>
                    </div>
                    <Globe className="text-gold" size={24} />
                 </div>
                 <div className="flex-1 space-y-10 overflow-y-auto pr-4 custom-scrollbar">
                    {revenueByState.map((state, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex flex-col">
                              <span className="text-lg font-display font-bold text-white group-hover:text-gold transition-colors">{state.regionName}</span>
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{state.uniqueSalons} Active Salons</span>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-bold font-display text-gold">AED {state.totalRevenue?.toLocaleString()}</p>
                              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Avg Rating: {state.averageRating?.toFixed(1)}</p>
                           </div>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-gold transition-all duration-1000 group-hover:bg-white" style={{ width: `${Math.min(100, (state.totalRevenue / (stats?.totalRevenue || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="mt-8 bg-white/50 backdrop-blur-md rounded-[40px] border border-gold/10 p-10">
         <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-display italic text-black-deep">Visits by Salon</h3>
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div> Live
            </div>
         </div>
         <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {visits.map((visit, i) => (
               <div key={i} className="flex-shrink-0 w-[280px] bg-white p-6 rounded-3xl border border-gold/5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-2xl bg-black-deep text-gold flex items-center justify-center font-black text-sm">
                        {visit.businessName.charAt(0)}
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-sm text-black-deep truncate group-hover:text-gold transition-colors">{visit.businessName}</p>
                        <p className="text-[9px] text-secondary/40 font-black uppercase tracking-widest">{new Date(visit.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2">
                        <Eye size={14} className="text-gold" />
                        <span className="text-xl font-bold text-black-deep">{visit.visitCount}</span>
                        <span className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">Visits</span>
                     </div>
                     {visit.uniqueCustomerCount && (
                        <div className="text-right">
                           <p className="text-xs font-bold text-emerald-500">{visit.uniqueCustomerCount}</p>
                           <p className="text-[8px] font-black text-secondary/20 uppercase tracking-tighter">Unique</p>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* MOBILE DETAILS MODAL */}
      {isDetailModalOpen && selectedSalon && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 lg:hidden">
          <div className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
              <div>
                <h3 className="font-display text-xl italic text-black-deep">Salon Details</h3>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black-deep text-gold flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedSalon.businessName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-black-deep leading-tight truncate">{selectedSalon.businessName}</h4>
                  <p className="text-sm text-secondary truncate">{selectedSalon.city}, {selectedSalon.state}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-xl font-bold text-black-deep">{selectedSalon.completedBookings}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-xl font-bold text-amber-500 flex items-center gap-1"><Star size={16} fill="currentColor" /> {selectedSalon.averageRating?.toFixed(1)}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 col-span-2">
                  <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">AED {selectedSalon.revenue?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
