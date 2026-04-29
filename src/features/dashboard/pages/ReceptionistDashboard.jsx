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
  ChevronUp
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/10 pb-6">
        <h1 className="text-3xl font-extrabold text-black-deep italic">Receptionist Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Filter:</span>
          <div className="flex bg-white p-1 rounded-xl border border-gold/10 shadow-sm">
            {[
              { id: "LAST_7_DAYS", label: "7 Days" },
              { id: "LAST_30_DAYS", label: "30 Days" },
              { id: "LAST_90_DAYS", label: "90 Days" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setRange(p.id);
                  setBookingRange(p.id);
                  setServicesRange(p.id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  range === p.id ? 'bg-black-deep text-white shadow-md' : 'text-slate-600 hover:text-black-deep hover:bg-slate-50'
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
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gold/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-${card.color}-50 flex items-center justify-center text-${card.color}-600`}>
                  <card.icon size={14} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-black-deep leading-tight">{card.value}</h3>
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
            className="flex items-center gap-2 mx-auto px-6 py-2 bg-white border border-gold/20 rounded-full text-xs font-bold text-gold hover:bg-gold/5 transition-all shadow-sm"
          >
            {showAllKpis ? (
              <>Show Less <ChevronUp size={14} /></>
            ) : (
              <>Show All Metrics ({kpiCards.length}) <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      {/* Booking Chart */}
      <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-black-deep">Booking Chart</h3>
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
                tick={{fontSize: 10, fontWeight: 700, fill: '#475569'}}
                tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#475569'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '10px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#ef4444" />
              <Bar dataKey="noShow" name="No Show" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Services */}
        <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-black-deep italic">Popular Services</h3>
            <div className="flex items-center gap-2">
              <RangeFilter current={servicesRange} onChange={setServicesRange} />
              <LimitFilter current={servicesLimit} onChange={setServicesLimit} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {servicesData?.byPopularity?.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black-deep font-bold text-sm shadow-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-black-deep">{service.serviceName}</h5>
                    <p className="text-xs font-semibold text-slate-600">{service.bookingCount} Bookings</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{service.percentageOfTotal}% Demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex flex-col h-[500px]">
          <div className="flex items-center gap-2 mb-8">
            <Users2 className="text-gold" size={20} />
            <h3 className="text-lg font-bold text-black-deep">Customer Segments</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Retention Rate", value: `${data?.customerInsights?.customerRetentionRate?.toFixed(1)}%` },
              { label: "Total Customers", value: data?.customerInsights?.totalCustomers },
              { label: "New Customers", value: data?.customerInsights?.newCustomers },
              { label: "Repeat Customers", value: data?.customerInsights?.repeatCustomers }
            ].map((item, i) => (
              <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                <h4 className="text-2xl font-extrabold text-black-deep">{item.value || 0}</h4>
              </div>
            ))}
          </div>

          <h4 className="text-md font-bold text-black-deep mb-4 px-1">Top Clients (By Bookings)</h4>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {(data?.customerInsights?.topSpenders || []).map((customer, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {customer.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-black-deep">{customer.customerName}</h5>
                    <p className="text-xs font-bold text-slate-600">{customer.bookingsCount} Bookings</p>
                  </div>
                </div>
                <p className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wide border border-amber-200">{customer.membershipLevel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
