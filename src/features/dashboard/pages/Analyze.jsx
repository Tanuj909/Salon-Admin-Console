import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart, 
  Activity, 
  Map, 
  Target,
  ArrowUpRight,
  Filter,
  Globe,
  TrendingUp,
  Award,
  Zap,
  Users
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

const Analyze = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueByCity, setRevenueByCity] = useState([]);
  const [revenueByState, setRevenueByState] = useState([]);
  const [topSalons, setTopSalons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyzeData();
  }, []);

  const fetchAnalyzeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      
      const results = await Promise.allSettled([
        superAdminDashboardService.getStats(),
        superAdminDashboardService.getRevenueByCity(),
        superAdminDashboardService.getRevenueByState(),
        superAdminDashboardService.getTopSalons('MONTH', today, 10, 'revenue')
      ]);

      if (results[0].status === 'fulfilled') setStats(results[0].value);
      if (results[1].status === 'fulfilled') setRevenueByCity(results[1].value);
      if (results[2].status === 'fulfilled') setRevenueByState(results[2].value);
      if (results[3].status === 'fulfilled') setTopSalons(results[3].value);

    } catch (err) {
      console.error("Error fetching analyze data:", err);
      setError("Failed to load analysis data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const metrics = [
    { 
      label: "Total Businesses", 
      value: stats?.totalBusinesses || 0, 
      sub: `${stats?.verifiedBusinesses || 0} Verified`, 
      icon: Target, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Average Rating", 
      value: stats?.averageRating?.toFixed(1) || "0.0", 
      sub: `${stats?.totalReviews || 0} Reviews`, 
      icon: Award, 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      sub: `${stats?.totalCustomers || 0} Customers`, 
      icon: Users, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
  ];

  const cityChartData = revenueByCity.slice(0, 5).map(city => ({
    name: city.regionName,
    revenue: city.totalRevenue,
    salons: city.uniqueSalons
  }));

  const COLORS = ['#C5A358', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-jost">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-8">
        <div>
          <h1 className="text-4xl font-display text-black-deep mb-2 italic tracking-tight">Platform Analysis</h1>
          <p className="text-secondary/60 text-[10px] font-black uppercase tracking-[0.3em]">Advanced Market Data & Regional Intelligence</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={fetchAnalyzeData}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gold/10 text-black-deep rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all active:scale-95 shadow-sm"
            >
                <Activity size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
            </button>
            <button className="px-6 py-3 bg-black-deep text-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all shadow-lg active:scale-95">
                Generate Report
            </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gold/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${m.bg} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10">
                <div className={`w-10 h-10 ${m.bg} ${m.color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                    <m.icon size={20} />
                </div>
                <p className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.2em] mb-1">{m.label}</p>
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-black-deep">{m.value}</h3>
                        <p className="text-[8px] font-bold text-secondary/40 uppercase tracking-widest mt-1">{m.sub}</p>
                    </div>
                    <div className="flex items-center text-emerald-500 text-[9px] font-black mb-1">
                        <ArrowUpRight size={12} /> +5.4%
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Revenue Bar Chart */}
        <div className="bg-white p-10 rounded-[48px] border border-gold/5 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xl font-display italic text-black-deep">City Performance</h3>
                    <p className="text-[9px] text-secondary/40 font-black uppercase tracking-[0.2em] mt-1">Revenue distribution by region</p>
                </div>
                <BarChart3 className="text-gold" size={24} />
            </div>
            
            <div className="flex-1 w-full">
                {cityChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cityChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                                width={100}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '15px' }}
                                cursor={{ fill: 'rgba(197, 163, 88, 0.05)' }}
                            />
                            <Bar dataKey="revenue" name="Revenue (AED )" fill="#C5A358" radius={[0, 10, 10, 0]} barSize={25} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-secondary/20 uppercase font-black text-xs tracking-widest italic">No regional data available</div>
                )}
            </div>
        </div>

        {/* State Revenue Pie Chart */}
        <div className="bg-white p-10 rounded-[48px] border border-gold/5 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xl font-display italic text-black-deep">State Contribution</h3>
                    <p className="text-[9px] text-secondary/40 font-black uppercase tracking-[0.2em] mt-1">Market share by territory</p>
                </div>
                <Globe className="text-gold" size={24} />
            </div>
            
            <div className="flex-1 w-full flex flex-col md:flex-row items-center">
                <div className="flex-1 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={revenueByState}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={8}
                                dataKey="totalRevenue"
                                nameKey="regionName"
                            >
                                {revenueByState.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4 pr-10">
                    {revenueByState.map((state, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-black-deep uppercase tracking-widest">{state.regionName}</span>
                                <span className="text-[9px] font-bold text-secondary/40">AED {state.totalRevenue.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Advanced Analytics Table */}
      <div className="bg-white p-10 rounded-[48px] border border-gold/5 shadow-sm">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h3 className="text-2xl font-display italic text-black-deep">Deep Performance Matrix</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Cross-referencing revenue with user engagement</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} /> Efficiency Index
                </div>
            </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-slate-50 rounded-[32px]">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                    <tr>
                        {['Partner Salon', 'City/State', 'Completed Bookings', 'Average Rating', 'Revenue Contribution'].map((h, i) => (
                            <th key={i} className="px-8 py-6 text-[10px] font-black text-secondary/40 uppercase tracking-widest border-b border-slate-50">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {topSalons.map((salon, i) => (
                        <tr key={i} className="group hover:bg-slate-50/30 transition-all cursor-default">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black-deep text-gold flex items-center justify-center font-black text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                                        {salon.businessName.charAt(0)}
                                    </div>
                                    <span className="font-bold text-xs text-black-deep group-hover:text-gold transition-colors">{salon.businessName}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-black-deep">{salon.city}</span>
                                    <span className="text-[9px] font-bold text-secondary/40 uppercase tracking-tighter">{salon.state}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-black-deep">{salon.completedBookings}</span>
                                    <div className="flex-1 max-w-[60px] h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                    <Award size={14} fill="currentColor" /> {salon.averageRating.toFixed(1)}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-xs font-black text-black-deep">
                                AED {salon.revenue?.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
