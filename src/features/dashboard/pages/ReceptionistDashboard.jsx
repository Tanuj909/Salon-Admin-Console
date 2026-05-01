import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  Target,
  Users2,
  Clock,
  UserCheck,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/context/BusinessContext";
import dashboardService from "@/services/dashboardService";
import { getBusinessTimingsApi } from "@/features/salons/services/timingService";

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const { businessId } = useBusiness();
  
  // Global Range
  const [range, setRange] = useState("LAST_30_DAYS");
  
  // Independent Section Filters
  const [bookingRange, setBookingRange] = useState("LAST_30_DAYS");
  const [servicesRange, setServicesRange] = useState("LAST_30_DAYS");
  const [servicesLimit, setServicesLimit] = useState(5);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Full data
  const [bookingData, setBookingData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [timings, setTimings] = useState([]);
  
  const [showAllKpis, setShowAllKpis] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFullDashboard();
  }, [range, businessId]);

  useEffect(() => {
    fetchBookingTrends();
  }, [bookingRange, businessId]);

  useEffect(() => {
    fetchTopServices();
  }, [servicesRange, servicesLimit, businessId]);

  useEffect(() => {
    if (businessId) fetchTimings();
  }, [businessId]);

  const fetchFullDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getFullDashboard(range, businessId);
      setData(res);
      if (range === bookingRange) setBookingData(res.bookingChart);
      if (range === servicesRange) setServicesData(res.topServices);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingTrends = async () => {
    try {
      const res = await dashboardService.getBookingTrends(bookingRange, businessId);
      setBookingData(res);
    } catch (err) { console.error(err); }
  };

  const fetchTopServices = async () => {
    try {
      const res = await dashboardService.getTopServices(servicesRange, businessId, servicesLimit);
      setServicesData(res);
    } catch (err) { console.error(err); }
  };

  const fetchTimings = async () => {
    try {
      const res = await getBusinessTimingsApi(businessId);
      setTimings(Array.isArray(res) ? res : (res?.body || []));
    } catch (err) { console.error(err); }
  };

  const kpiCards = useMemo(() => {
    if (!data?.kpiCards) return [];
    const k = data.kpiCards;
    return [
      { label: "Total Bookings", value: k.totalBookings, icon: Calendar, color: "blue", growth: k.bookingsGrowth },
      { label: "Completed", value: k.completedBookings, icon: CheckCircle2, color: "emerald" },
      { label: "Completion Rate", value: `${k.completionRate}%`, icon: Target, color: "emerald" },
      { label: "Pending Bookings", value: k.pendingBookings, icon: Clock, color: "amber" },
      { label: "Confirmed", value: k.confirmedBookings, icon: UserCheck, color: "blue" },
      { label: "Active Customers", value: k.activeCustomers, icon: Users, color: "purple", growth: k.customerGrowth },
      { label: "Cancelled", value: k.cancelledBookings, icon: XCircle, color: "red" },
      { label: "Cancellation Rate", value: `${k.cancellationRate}%`, icon: Activity, color: "red" },
      { label: "Total Staff", value: k.staffCount, icon: Users2, color: "slate" },
      { label: "Active Staff", value: k.activeStaff, icon: Zap, color: "blue" },
      { label: "Average Rating", value: k.averageRating, icon: Star, color: "amber" },
    ];
  }, [data]);

  const displayedKpis = showAllKpis ? kpiCards : kpiCards.slice(0, 6);

  const todayTiming = useMemo(() => {
    if (!timings.length) return null;
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const today = days[new Date().getDay()];
    return timings.find(t => t.dayOfWeek === today);
  }, [timings]);

  if (loading && !data) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[80vh] bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const RangeFilter = ({ current, onChange }) => (
    <div className="flex bg-slate-100 p-1 rounded-lg">
      {[
        { id: "LAST_7_DAYS", label: "7D" },
        { id: "LAST_30_DAYS", label: "30D" },
        { id: "LAST_90_DAYS", label: "90D" }
      ].map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
            current === p.id ? 'bg-black-deep text-white shadow-sm' : 'text-slate-500 hover:text-black-deep'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );

  const LimitFilter = ({ current, onChange }) => (
    <select 
      value={current} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-slate-100 text-[10px] font-bold px-2 py-1 rounded-lg border-none outline-none"
    >
      {[5, 10, 20].map(val => (
        <option key={val} value={val}>Limit: {val}</option>
      ))}
    </select>
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-sans pb-20">
      {/* Header with Responsive Global Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-black-deep leading-tight italic font-display">Receptionist Overview</h1>
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-[0.3em] mt-1">Operational Console</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-gold/5 shadow-inner">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Filter:</span>
          <div className="flex bg-white p-1 rounded-xl border border-gold/10 shadow-sm overflow-hidden">
            {[
              { id: "LAST_7_DAYS", label: "7D" },
              { id: "LAST_30_DAYS", label: "30D" },
              { id: "LAST_90_DAYS", label: "90D" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setRange(p.id);
                  setBookingRange(p.id);
                  setServicesRange(p.id);
                }}
                className={`px-4 lg:px-6 py-2 rounded-lg text-[10px] lg:text-xs font-black tracking-widest transition-all ${
                  range === p.id 
                    ? 'bg-black-deep text-gold shadow-md' 
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedKpis.map((card, idx) => (
            <div key={idx} className="bg-white p-4 lg:p-5 rounded-2xl lg:rounded-[24px] border border-gold/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 shadow-sm`}>
                  <card.icon size={16} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-black-deep leading-tight italic font-display">{card.value}</h3>
                {card.growth !== undefined && (
                  <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold ${
                    card.growth >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {card.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{Math.abs(card.growth)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {kpiCards.length > 6 && (
          <button 
            onClick={() => setShowAllKpis(!showAllKpis)}
            className="flex items-center gap-2 mx-auto px-8 py-2.5 bg-white border border-gold/10 rounded-full text-[10px] font-black text-gold uppercase tracking-widest hover:bg-gold/5 transition-all shadow-sm active:scale-95"
          >
            {showAllKpis ? (
              <>Show Less <ChevronUp size={14} /></>
            ) : (
              <>Show All Metrics ({kpiCards.length}) <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      {/* Booking Chart & Business Hours Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gold/5 shadow-sm p-6 lg:p-8 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Booking Pipeline</h3>
            <RangeFilter current={bookingRange} onChange={setBookingRange} />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData?.points || []}>
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
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '15px', color: '#94a3b8' }} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#ef4444" />
                <Bar dataKey="noShow" name="No Show" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Hours Sidebar Card */}
        <div className="bg-black-deep rounded-[32px] p-6 lg:p-8 text-white border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gold/20 flex items-center justify-center text-gold border border-gold/20">
                   <Clock size={20} />
                </div>
                <div>
                   <h3 className="text-lg font-display italic">Business Timing</h3>
                   <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Operating Hours</p>
                </div>
              </div>

              {todayTiming ? (
                <div className="mb-8">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Today's Status</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        todayTiming.isClosed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {todayTiming.isClosed ? 'Closed' : 'Open Now'}
                      </span>
                   </div>
                   {!todayTiming.isClosed && (
                     <div className="text-3xl font-display italic text-gold">
                        {todayTiming.openTime} - {todayTiming.closeTime}
                     </div>
                   )}
                </div>
              ) : (
                <div className="mb-8 py-4 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Loading Schedule...</div>
              )}

              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                 {timings.map((t, i) => (
                   <div key={i} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${t.dayOfWeek === todayTiming?.dayOfWeek ? 'text-gold font-bold' : 'text-white/60'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{t.dayOfWeek.slice(0, 3)}</span>
                      <span className="text-[10px] font-bold">
                        {t.isClosed ? (
                          <span className="text-red-400/60 uppercase tracking-tighter">Closed</span>
                        ) : (
                          `${t.openTime} - ${t.closeTime}`
                        )}
                      </span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Popular Services */}
        <div className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-gold/5 shadow-sm flex flex-col min-h-[450px] lg:h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl lg:text-2xl font-display italic text-black-deep">Popular Services</h3>
            <div className="flex items-center gap-3 self-end lg:self-auto">
              <RangeFilter current={servicesRange} onChange={setServicesRange} />
              <LimitFilter current={servicesLimit} onChange={setServicesLimit} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {servicesData?.byPopularity?.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 lg:p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-slate-100 hover:border-gold/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-black-deep">{service.serviceName}</h5>
                    <p className="text-[10px] font-bold text-slate-400">{service.bookingCount} Bookings</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">{service.percentageOfTotal}% Demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border border-gold/5 shadow-sm flex flex-col min-h-[450px] lg:h-[500px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
              <Users2 size={24} />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-display italic text-black-deep">Customer Segments</h3>
              <p className="text-[10px] text-secondary/40 font-black uppercase tracking-[0.2em]">Audience Engagement</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Retention Rate", value: `${data?.customerInsights?.customerRetentionRate?.toFixed(1)}%` },
              { label: "Total Customers", value: data?.customerInsights?.totalCustomers },
              { label: "New Customers", value: data?.customerInsights?.newCustomers },
              { label: "Repeat Customers", value: data?.customerInsights?.repeatCustomers }
            ].map((item, i) => (
              <div key={i} className="p-4 lg:p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <h4 className="text-xl lg:text-2xl font-display font-bold text-black-deep">{item.value || 0}</h4>
              </div>
            ))}
          </div>

          <h4 className="text-md font-bold text-black-deep mb-4 px-1 flex items-center gap-2">
            <Star size={16} className="text-gold fill-gold" /> Top Clients (By Bookings)
          </h4>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {(data?.customerInsights?.topSpenders || []).map((customer, i) => (
              <div key={i} className="flex items-center justify-between p-4 lg:p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-slate-100 hover:border-gold/20 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-black-deep">{customer.customerName}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.bookingsCount} Bookings</p>
                  </div>
                </div>
                <p className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider border border-amber-100">{customer.membershipLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
