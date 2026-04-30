import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
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
  ShoppingBag,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Filter
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const { businessId } = useBusiness();
  const navigate = useNavigate();
  
  // Global Range
  const [range, setRange] = useState("LAST_30_DAYS");
  
  // Independent Section Filters
  const [revenueRange, setRevenueRange] = useState("LAST_30_DAYS");
  const [bookingRange, setBookingRange] = useState("LAST_30_DAYS");
  const [servicesRange, setServicesRange] = useState("LAST_30_DAYS");
  const [servicesLimit, setServicesLimit] = useState(5);
  const [staffRange, setStaffRange] = useState("LAST_30_DAYS");
  const [staffLimit, setStaffLimit] = useState(5);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); 
  const [revenueData, setRevenueData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [staffData, setStaffData] = useState(null);
  
  const [showAllKpis, setShowAllKpis] = useState(false);
  const [error, setError] = useState(null);

  // Initial and range-based fetch
  useEffect(() => {
    fetchFullDashboard();
  }, [range, businessId]);

  useEffect(() => {
    fetchRevenueTrends();
  }, [revenueRange, businessId]);

  useEffect(() => {
    fetchBookingTrends();
  }, [bookingRange, businessId]);

  useEffect(() => {
    fetchTopServices();
  }, [servicesRange, servicesLimit, businessId]);

  useEffect(() => {
    fetchStaffPerformance();
  }, [staffRange, staffLimit, businessId]);

  const fetchFullDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getFullDashboard(range, businessId);
      setData(res);
      if (range === revenueRange) setRevenueData(res.revenueChart);
      if (range === bookingRange) setBookingData(res.bookingChart);
      if (range === servicesRange) setServicesData(res.topServices);
      if (range === staffRange) setStaffData(res.staffPerformance);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueTrends = async () => {
    try {
      const res = await dashboardService.getRevenueTrends(revenueRange, businessId);
      setRevenueData(res);
    } catch (err) { console.error(err); }
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

  const fetchStaffPerformance = async () => {
    try {
      const res = await dashboardService.getStaffPerformance(staffRange, businessId, staffLimit);
      setStaffData(res);
    } catch (err) { console.error(err); }
  };

  const kpiCards = useMemo(() => {
    if (!data?.kpiCards) return [];
    const k = data.kpiCards;
    return [
      { label: "Total Revenue", value: `AED ${k.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: "emerald", growth: k.revenueGrowth },
      { label: "Total Bookings", value: k.totalBookings, icon: Calendar, color: "blue", growth: k.bookingsGrowth },
      { label: "Completed", value: k.completedBookings, icon: CheckCircle2, color: "emerald" },
      { label: "Completion Rate", value: `${k.completionRate}%`, icon: Target, color: "emerald" },
      { label: "Cancelled", value: k.cancelledBookings, icon: XCircle, color: "red" },
      { label: "Cancellation Rate", value: `${k.cancellationRate}%`, icon: Activity, color: "red" },
      { label: "Active Customers", value: k.activeCustomers, icon: Users, color: "purple", growth: k.customerGrowth },
      { label: "Avg Booking Value", value: `AED ${k.averageBookingValue}`, icon: ShoppingBag, color: "amber" },
      { label: "Pending Bookings", value: k.pendingBookings, icon: Clock, color: "amber" },
      { label: "Confirmed", value: k.confirmedBookings, icon: UserCheck, color: "blue" },
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
      className="bg-slate-100 text-[10px] font-bold px-2 py-1 rounded-lg border-none focus:ring-1 focus:ring-gold outline-none"
    >
      {[5, 10, 20, 50].map(val => (
        <option key={val} value={val}>Limit: {val}</option>
      ))}
    </select>
  );

  const renderStaffList = (staffList, title, icon) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-md font-bold text-black-deep">{title}</h3>
      </div>
      <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 h-[300px]">
        {staffList?.length > 0 ? staffList.map((staff, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                {staff.staffName.charAt(0)}
              </div>
              <div>
                <h5 className="font-bold text-sm text-black-deep">{staff.staffName}</h5>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-slate-700">{staff.averageRating?.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">AED {staff.revenue?.toLocaleString()}</p>
              <p className="text-xs font-semibold text-slate-600">{staff.completedBookings} Bookings</p>
            </div>
          </div>
        )) : <p className="text-sm font-bold text-slate-500">No data</p>}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/10 pb-6">
        <h1 className="text-3xl font-extrabold text-black-deep">Admin Dashboard</h1>
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
                  setRevenueRange(p.id);
                  setBookingRange(p.id);
                  setServicesRange(p.id);
                  setStaffRange(p.id);
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

      {/* KPI Cards Grid */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-black-deep">Revenue Chart</h3>
            <RangeFilter current={revenueRange} onChange={setRevenueRange} />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData?.points || []}>
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
                <Bar dataKey="revenue" fill="#C5A358" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
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
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h3 className="text-xl font-bold text-black-deep italic">Top Services</h3>
          <div className="flex items-center gap-3">
            <RangeFilter current={servicesRange} onChange={setServicesRange} />
            <LimitFilter current={servicesLimit} onChange={setServicesLimit} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* By Revenue */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-emerald-500" size={18} />
              <span className="text-sm font-bold text-slate-700">By Revenue</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {servicesData?.byRevenue?.map((service, i) => (
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
                  <p className="text-sm font-bold text-emerald-600">AED {service.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          {/* By Popularity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-blue-500" size={18} />
              <span className="text-sm font-bold text-slate-700">By Popularity</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {servicesData?.byPopularity?.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black-deep font-bold text-sm shadow-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-black-deep">{service.serviceName}</h5>
                      <p className="text-xs font-semibold text-slate-600">Used {service.bookingCount} times</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-600">AED {service.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Performance Row */}
      <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h3 className="text-xl font-bold text-black-deep italic">Staff Performance</h3>
          <div className="flex items-center gap-3">
            <RangeFilter current={staffRange} onChange={setStaffRange} />
            <LimitFilter current={staffLimit} onChange={setStaffLimit} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderStaffList(staffData?.topPerformers, "Top Performers", <ThumbsUp className="text-emerald-500" size={20} />)}
          {renderStaffList(staffData?.bottomPerformers, "Bottom Performers", <ThumbsDown className="text-red-500" size={20} />)}
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users2 className="text-gold" size={20} />
          <h3 className="text-lg font-bold text-black-deep">Customer Insights</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        <h4 className="text-md font-bold text-black-deep mb-4 px-1">Top Spenders</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">AED {customer.totalSpent?.toLocaleString()}</p>
                <p className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wide border border-amber-200">{customer.membershipLevel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Overview */}
      <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <DollarSign className="text-gold" size={20} />
            <h3 className="text-lg font-bold text-black-deep">Payroll Overview</h3>
          </div>
          <button 
            onClick={() => navigate('/salaries')}
            className="text-xs font-bold text-gold hover:underline uppercase tracking-widest"
          >
            View Full Report
          </button>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Total Monthly Payout Estimated</p>
           <h4 className="text-4xl font-display italic text-black-deep mb-4">AED {data?.kpiCards?.totalRevenue ? (data.kpiCards.totalRevenue * 0.3).toFixed(0).toLocaleString() : '---'}</h4>
           <p className="text-[10px] text-secondary max-w-sm mx-auto italic">
             This is an estimate based on your revenue trends. For exact payroll breakdown including individual commissions, please visit the Salaries section.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
