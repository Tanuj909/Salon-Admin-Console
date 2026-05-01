import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusinessSalariesApi } from "@/features/staff/services/staffService";
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
  Filter,
  ChevronRight
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

  // Payroll specific state
  const [payrollData, setPayrollData] = useState([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const currentMonth = new Date().toISOString().substring(0, 7);

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

  useEffect(() => {
    fetchPayroll();
  }, [businessId]);

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

  const fetchPayroll = async () => {
    if (!businessId) return;
    try {
      setPayrollLoading(true);
      const res = await getBusinessSalariesApi(businessId, currentMonth);
      setPayrollData(res.body || res || []);
    } catch (err) {
      console.error("Error fetching payroll overview", err);
    } finally {
      setPayrollLoading(false);
    }
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

  const RangeFilter = ({ current, onChange, isMobileSmall = false }) => (
    <div className={`flex bg-slate-100 p-1 rounded-lg ${isMobileSmall ? 'scale-90 lg:scale-100' : ''}`}>
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
      {/* Header with Responsive Global Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/10 pb-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-black-deep leading-tight">Admin Dashboard</h1>
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-[0.3em] mt-1">Management Console</p>
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
                  setRevenueRange(p.id);
                  setBookingRange(p.id);
                  setServicesRange(p.id);
                  setStaffRange(p.id);
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

      {/* KPI Cards Grid */}
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

      {/* Charts Grid - Responsive Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-[32px] border border-gold/5 shadow-sm p-6 lg:p-8 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Revenue Trend</h3>
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
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Bar dataKey="revenue" fill="#C5A358" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
        <div className="bg-white rounded-[32px] border border-gold/5 shadow-sm p-6 lg:p-8 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl font-display italic text-black-deep">Booking Activity</h3>
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
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gold/5 shadow-sm p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <h3 className="text-2xl font-display italic text-black-deep">Top Services</h3>
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <RangeFilter current={servicesRange} onChange={setServicesRange} />
            <LimitFilter current={servicesLimit} onChange={setServicesLimit} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* By Revenue */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign size={16} />
              </div>
              <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">By Revenue Distribution</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {servicesData?.byRevenue?.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 lg:p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-slate-100 hover:border-gold/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div>
                      <h5 className="font-bold text-sm text-black-deep">{service.serviceName}</h5>
                      <p className="text-[10px] font-bold text-slate-400">{service.bookingCount} Bookings</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">AED {service.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          {/* By Popularity */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Target size={16} />
              </div>
              <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">By Volume Frequency</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {servicesData?.byPopularity?.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 lg:p-5 bg-slate-50/50 rounded-2xl hover:bg-white border border-slate-100 hover:border-gold/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div>
                      <h5 className="font-bold text-sm text-black-deep">{service.serviceName}</h5>
                      <p className="text-[10px] font-bold text-slate-400">Used {service.bookingCount} times</p>
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
      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gold/5 shadow-sm p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <h3 className="text-2xl font-display italic text-black-deep">Staff Performance</h3>
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <RangeFilter current={staffRange} onChange={setStaffRange} />
            <LimitFilter current={staffLimit} onChange={setStaffLimit} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {renderStaffList(staffData?.topPerformers, "Top Performers", <ThumbsUp className="text-emerald-500" size={20} />)}
          {renderStaffList(staffData?.bottomPerformers, "Bottom Performers", <ThumbsDown className="text-red-500" size={20} />)}
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gold/5 shadow-sm p-6 lg:p-10">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
             <size size={24} />
           </div>
           <div>
             <h3 className="text-2xl font-display italic text-black-deep">Customer Insights</h3>
             <p className="text-[10px] text-secondary/40 font-black uppercase tracking-[0.2em]">Audience Engagement</p>
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Retention Rate", value: `${data?.customerInsights?.customerRetentionRate?.toFixed(1)}%` },
            { label: "Total Customers", value: data?.customerInsights?.totalCustomers },
            { label: "New Customers", value: data?.customerInsights?.newCustomers },
            { label: "Repeat Customers", value: data?.customerInsights?.repeatCustomers }
          ].map((item, i) => (
            <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className="text-2xl font-display font-bold text-black-deep">{item.value || 0}</h4>
            </div>
          ))}
        </div>

        <h4 className="text-md font-bold text-black-deep mb-6 px-1 flex items-center gap-2">
           <Star size={16} className="text-gold fill-gold" /> Top Spenders
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.customerInsights?.topSpenders || []).map((customer, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:border-gold/20 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div>
                  <h5 className="font-bold text-sm text-black-deep">{customer.customerName}</h5>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.bookingsCount} Bookings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">AED {customer.totalSpent?.toLocaleString()}</p>
                <p className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider border border-amber-100">{customer.membershipLevel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Overview - Optimized for Mobile */}
      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gold/5 shadow-sm p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10 shadow-sm">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-display italic text-black-deep">Payroll Overview</h3>
              <p className="text-[10px] text-secondary/40 font-black uppercase tracking-[0.2em]">{new Date(currentMonth + "-01").toLocaleDateString("default", { month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/salaries")}
            className="w-full sm:w-auto px-8 py-3 bg-black-deep text-gold text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gold/10 hover:bg-gold hover:text-black-deep transition-all shadow-lg shadow-gold/5 active:scale-95"
          >
            Full Report
          </button>
        </div>
        
        {payrollLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold/10 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.3em]">Processing Records...</p>
          </div>
        ) : (
          <div className="w-full">
             <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {payrollData.length > 0 ? payrollData.map((staff, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 lg:p-6 bg-slate-50/50 rounded-2xl lg:rounded-3xl border border-slate-100 hover:border-gold/30 hover:bg-white transition-all group shadow-sm hover:shadow-xl hover:shadow-gold/5">
                     <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div>
                           <h5 className="font-bold text-base lg:text-lg text-black-deep leading-none mb-2">{staff.staffName}</h5>
                           <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                              <span className="text-[10px] text-secondary/40 font-black uppercase tracking-widest">{staff.designation}</span>
                              <div className="hidden lg:block w-1 h-1 bg-slate-300 rounded-full" />
                              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                 <CheckCircle2 size={10} className="text-emerald-600" />
                                 <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Verified</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                        <p className="font-display italic text-black-deep text-xl lg:text-2xl">AED {staff.totalAmount?.toLocaleString()}</p>
                     </div>
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                     <DollarSign size={48} className="mb-4 opacity-10" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary/20">Empty Transaction Ledger</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
