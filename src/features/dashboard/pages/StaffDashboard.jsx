import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Award,
  Zap,
  Clock,
  ArrowRight,
  Target,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from "@/hooks/useAuth";
import dashboardService from "@/services/dashboardService";
import { getStaffMyBookingsApi } from "@/services/bookingService";
import { getMySalaryApi } from "@/features/staff/services/staffService";

const StaffDashboard = () => {
  const { user } = useAuth();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const monthsList = [
    { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
    { val: 4, name: 'April' }, { val: 5, name: 'May' }, { val: 6, name: 'June' },
    { val: 7, name: 'July' }, { val: 8, name: 'August' }, { val: 9, name: 'September' },
    { val: 10, name: 'October' }, { val: 11, name: 'November' }, { val: 12, name: 'December' }
  ];
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [staffBookings, setStaffBookings] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [salaryData, setSalaryData] = useState(null);
  
  const [performanceRange, setPerformanceRange] = useState("LAST_30_DAYS");
  const [servicesRange, setServicesRange] = useState("LAST_30_DAYS");
  const [performanceLimit, setPerformanceLimit] = useState(5);
  const [servicesLimit, setServicesLimit] = useState(5);
  
  const [performanceData, setPerformanceData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  
  const [error, setError] = useState(null);

  const businessId = user?.businessId || user?.business?.id;

  useEffect(() => {
    fetchBaseData();
  }, [businessId, year, month]);

  useEffect(() => {
    if (businessId) fetchPerformance();
  }, [businessId, performanceRange, performanceLimit]);

  useEffect(() => {
    if (businessId) fetchServices();
  }, [businessId, servicesRange, servicesLimit]);

  const fetchBaseData = async () => {
    try {
      setLoading(true);
      const selectedYearMonth = `${year}-${String(month).padStart(2, '0')}`;
      
      const [dashboardData, bookingsResponse, salaryResponse] = await Promise.all([
        dashboardService.getFullDashboard("LAST_30_DAYS", businessId),
        getStaffMyBookingsApi(0, 500), 
        getMySalaryApi(selectedYearMonth)
      ]);

      setData(dashboardData);
      setStaffBookings(bookingsResponse.content || []);
      setSalaryData(salaryResponse.body || salaryResponse);
    } catch (err) {
      console.error("Error fetching staff dashboard base data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const perf = await dashboardService.getStaffPerformance(performanceRange, businessId, performanceLimit);
      setPerformanceData(perf);
    } catch (err) {
      console.error("Error fetching performance data:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const serv = await dashboardService.getTopServices(servicesRange, businessId, servicesLimit);
      setServicesData(serv);
    } catch (err) {
      console.error("Error fetching services data:", err);
    }
  };

  const bookingStats = useMemo(() => {
    const stats = {
      PENDING: 0, CONFIRMED: 0, CHECKED_IN: 0, IN_PROGRESS: 0, COMPLETED: 0,
      CANCELLED_BY_CUSTOMER: 0, CANCELLED_BY_SALON: 0, TOTAL: staffBookings.length
    };
    staffBookings.forEach(booking => {
      if (stats[booking.status] !== undefined) stats[booking.status]++;
    });
    return stats;
  }, [staffBookings]);

  const kpiCards = useMemo(() => {
    return [
      { label: "My Completed", value: bookingStats.COMPLETED, color: "emerald" },
      { label: "Active", value: bookingStats.CONFIRMED + bookingStats.CHECKED_IN + bookingStats.IN_PROGRESS, color: "blue" },
      { label: "Avg Rating", value: performanceData?.topPerformers?.find(s => s.staffName === user?.fullName)?.averageRating?.toFixed(1) || "5.0", color: "amber" },
      { label: "Earnings", value: `AED ${salaryData?.totalCommissionEarned?.toLocaleString() || '0'}`, color: "gold" },
    ];
  }, [bookingStats, performanceData, salaryData, user]);

  if (loading && !data) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[80vh] bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const rangeOptions = [
    { id: "LAST_7_DAYS", label: "7D" },
    { id: "LAST_30_DAYS", label: "30D" },
    { id: "LAST_90_DAYS", label: "90D" }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen font-jost pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/10 pb-8 px-2">
        <div>
          <h1 className="text-4xl lg:text-5xl font-display text-black-deep italic tracking-tight">Staff Overview</h1>
          <p className="text-secondary/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Welcome back, {user?.fullName}</p>
        </div>
      </div>

      {/* KPI Cards - Compact version for mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white px-4 py-4 lg:px-6 lg:py-5 rounded-[20px] lg:rounded-[24px] border border-gold/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-center min-h-[80px] lg:min-h-[110px]">
            <div className={`absolute -right-2 -top-2 w-12 h-12 lg:w-16 lg:h-16 bg-${card.color}-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10">
              <p className="text-[8px] lg:text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-0.5 lg:mb-1">{card.label}</p>
              <h3 className="text-xl lg:text-3xl font-display font-bold text-black-deep leading-none">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Booking Status Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-[32px] lg:rounded-[40px] border border-gold/5 shadow-sm p-6 lg:p-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl lg:text-2xl font-display italic text-black-deep">Booking Pipeline</h3>
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-secondary/30 mt-1">Real-time status distribution</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-50 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-bold text-slate-500 uppercase">
                 Total: {bookingStats.TOTAL}
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Pending", count: bookingStats.PENDING, color: "slate" },
                { label: "Confirmed", count: bookingStats.CONFIRMED, color: "blue" },
                { label: "Checked In", count: bookingStats.CHECKED_IN, color: "purple" },
                { label: "In Progress", count: bookingStats.IN_PROGRESS, color: "amber" },
                { label: "Completed", count: bookingStats.COMPLETED, color: "emerald" },
                { label: "Cancelled", count: bookingStats.CANCELLED_BY_CUSTOMER + bookingStats.CANCELLED_BY_SALON, color: "red" }
              ].map((status, i) => (
                <div key={i} className="p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center text-center">
                   <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-${status.color}-50 flex items-center justify-center text-${status.color}-600 mb-1.5 lg:mb-2 font-bold text-[10px] lg:text-xs`}>
                      {status.count}
                   </div>
                   <p className="text-[8px] lg:text-[9px] font-bold text-secondary uppercase tracking-widest">{status.label}</p>
                </div>
              ))}
           </div>
        </div>

        {/* My Monthly Payout Summary */}
        <div className="bg-black-deep rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8 relative z-10">
             <h3 className="text-xl font-display italic text-gold m-0">Payroll Summary</h3>
             <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <select 
                   value={month}
                   onChange={(e) => setMonth(parseInt(e.target.value))}
                   className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer px-2"
                >
                   {monthsList.map(m => <option key={m.val} value={m.val} className="text-black">{m.name.substring(0, 3)}</option>)}
                </select>
                <div className="w-px h-3 bg-white/10" />
                <select 
                   value={year}
                   onChange={(e) => setYear(parseInt(e.target.value))}
                   className="bg-transparent text-[10px] font-bold text-white outline-none cursor-pointer px-2"
                >
                   {years.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                </select>
             </div>
           </div>
           
           <div className="space-y-4 lg:space-y-6 relative z-10">
              <div className="p-5 lg:p-6 bg-white/5 rounded-2xl lg:rounded-3xl border border-white/10">
                 <p className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Period Performance</p>
                 <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] lg:text-xs text-white/60">Base Salary</span>
                       <span className="text-sm lg:text-lg font-display text-white">AED {salaryData?.monthlySalary?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] lg:text-xs text-white/60">Commissions</span>
                       <span className="text-sm lg:text-lg font-display text-emerald-400">+ AED {salaryData?.totalCommissionEarned?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="pt-3 lg:pt-4 border-t border-white/10 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Net Total</span>
                       <span className="text-xl lg:text-2xl font-display italic text-white">AED {salaryData?.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gold/5 rounded-xl lg:rounded-2xl border border-gold/10">
                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gold flex items-center justify-center text-black-deep">
                    <Briefcase size={16} />
                 </div>
                 <div>
                    <p className="text-[8px] lg:text-[9px] font-black text-gold uppercase tracking-widest">Work Period</p>
                    <p className="text-[10px] lg:text-xs font-bold text-white uppercase">{`${monthsList.find(m => m.val === month)?.name} ${year}`}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* High Demand Services */}
        <div className="bg-white rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 border border-gold/5 shadow-sm flex flex-col min-h-[450px] lg:h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <h3 className="text-xl lg:text-2xl font-display italic text-black-deep">Top Services</h3>
              <div className="flex items-center gap-2 mt-2">
                 {rangeOptions.map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => setServicesRange(opt.id)}
                     className={`text-[8px] lg:text-[9px] font-bold px-2 lg:px-2.5 py-1 rounded-lg border transition-all ${servicesRange === opt.id ? 'bg-black-deep text-gold border-black-deep shadow-sm' : 'bg-transparent text-secondary/40 border-slate-100 hover:border-gold/20'}`}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <select 
                value={servicesLimit}
                onChange={(e) => setServicesLimit(parseInt(e.target.value))}
                className="text-[9px] font-bold px-2 py-1 rounded-lg border border-slate-100 bg-white text-secondary/60 outline-none"
              >
                {[5, 10, 20, 50].map(l => <option key={l} value={l}>Top {l}</option>)}
              </select>
              <Layers className="text-gold hidden sm:block" size={24} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-3">
              {(servicesData?.byPopularity || []).map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 lg:p-5 bg-slate-50/50 rounded-xl lg:rounded-2xl hover:bg-slate-50 transition-all group border border-slate-100/50">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white border border-gold/10 flex items-center justify-center text-black-deep font-display font-bold text-base lg:text-lg shadow-sm group-hover:rotate-6 transition-transform">
                      {service.serviceName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs lg:text-sm text-black-deep group-hover:text-gold transition-colors">{service.serviceName}</h5>
                      <p className="text-[7px] lg:text-[8px] font-black text-secondary/40 uppercase tracking-widest">{service.bookingCount} Bookings</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="bg-white rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 border border-gold/5 shadow-sm flex flex-col min-h-[450px] lg:h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <h3 className="text-xl lg:text-2xl font-display italic text-black-deep">Team Leaderboard</h3>
              <div className="flex items-center gap-2 mt-2">
                 {rangeOptions.map(opt => (
                   <button 
                     key={opt.id}
                     onClick={() => setPerformanceRange(opt.id)}
                     className={`text-[8px] lg:text-[9px] font-bold px-2 lg:px-2.5 py-1 rounded-lg border transition-all ${performanceRange === opt.id ? 'bg-black-deep text-gold border-black-deep shadow-sm' : 'bg-transparent text-secondary/40 border-slate-100 hover:border-gold/20'}`}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <select 
                value={performanceLimit}
                onChange={(e) => setPerformanceLimit(parseInt(e.target.value))}
                className="text-[9px] font-bold px-2 py-1 rounded-lg border border-slate-100 bg-white text-secondary/60 outline-none"
              >
                {[5, 10, 20, 50].map(l => <option key={l} value={l}>Top {l}</option>)}
              </select>
              <Award size={24} className="text-gold hidden sm:block" size={24} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-3">
              {(performanceData?.topPerformers || []).map((staff, i) => (
                <div key={i} className={`flex items-center justify-between p-4 lg:p-5 rounded-xl lg:rounded-2xl transition-all group border ${staff.staffName === user?.fullName ? 'bg-gold/5 border-gold/20' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black-deep flex items-center justify-center text-gold font-bold text-[10px] lg:text-xs">
                      {staff.staffName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <h5 className="font-bold text-xs lg:text-sm text-black-deep">{staff.staffName}</h5>
                         {staff.staffName === user?.fullName && <span className="bg-gold text-black-deep text-[7px] lg:text-[8px] font-black px-1.5 py-0.5 rounded uppercase">You</span>}
                      </div>
                      <p className="text-[7px] lg:text-[8px] font-black text-secondary/40 uppercase tracking-widest">{staff.completedBookings} Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] lg:text-xs font-bold text-amber-500">
                    <Star size={10} lg:size={12} fill="currentColor" /> {staff.averageRating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
