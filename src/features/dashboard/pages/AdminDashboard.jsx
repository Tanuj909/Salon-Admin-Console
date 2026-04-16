import React from 'react';
import { 
  IndianRupee, 
  Calendar, 
  Users, 
  UserCheck, 
  CreditCard,
  TrendingUp
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RevenueTrendChart from '../components/RevenueTrendChart';
import ServicePopularityChart from '../components/ServicePopularityChart';
import RecentBookingsTable from '../components/RecentBookingsTable';
import StaffPerformance from '../components/StaffPerformance';
import UpcomingAppointments from '../components/UpcomingAppointments';
import RevenueBreakdown from '../components/RevenueBreakdown';
import TopServices from '../components/TopServices';
import InventoryAlert from '../components/InventoryAlert';
import PaymentMethods from '../components/PaymentMethods';

const AdminDashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#FDFBF7] min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-jost">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring your salon's performance and operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</span>
            <span className="text-green-600 font-bold text-sm">Online & Active</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ── Section 1: Stats Cards (6 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard 
          title="Total Revenue (Today)" 
          value="₹4,250" 
          icon={IndianRupee} 
          trend="up" 
          trendValue="12" 
          color="blue" 
        />
        <StatsCard 
          title="Total Bookings (Today)" 
          value="18" 
          icon={Calendar} 
          trend="up" 
          trendValue="5" 
          color="purple" 
        />
        <StatsCard 
          title="Monthly Revenue" 
          value="₹1,45,200" 
          icon={IndianRupee} 
          trend="down" 
          trendValue="4.5" 
          color="green" 
        />
        <StatsCard 
          title="Active Customers" 
          value="1,240" 
          icon={Users} 
          trend="up" 
          trendValue="8" 
          color="orange" 
        />
        <StatsCard 
          title="Staff Available" 
          value="8/12" 
          icon={UserCheck} 
          color="blue" 
        />
        <StatsCard 
          title="Pending Payments" 
          value="₹2,800" 
          icon={CreditCard} 
          color="red" 
        />
      </div>

      {/* ── Section 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueTrendChart />
        </div>
        <div className="lg:col-span-1">
          <ServicePopularityChart />
        </div>
      </div>

      {/* ── Section 3: Detailed Widgets ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RevenueBreakdown />
        <TopServices />
        <PaymentMethods />
      </div>

      {/* ── Section 4: Recent Bookings Table ── */}
      <div className="w-full">
        <RecentBookingsTable />
      </div>

      {/* ── Section 5: Upcoming & Performance ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <UpcomingAppointments />
        <StaffPerformance />
      </div>
    </div>
  );
};

export default AdminDashboard;
