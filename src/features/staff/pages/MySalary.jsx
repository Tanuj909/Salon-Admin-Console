import React, { useState, useEffect } from 'react';
import { getMySalaryApi } from '../services/staffService';
import { Wallet, Calendar, User, Briefcase, DollarSign, Hash, CheckCircle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const MySalary = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    fetchMySalary();
  }, [month]);

  const fetchMySalary = async () => {
    try {
      setLoading(true);
      const data = await getMySalaryApi(month);
      setSalaryData(data.body || data);
    } catch (err) {
      console.error("Error fetching my salary", err);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (delta) => {
    const date = new Date(month + '-01');
    date.setMonth(date.getMonth() + delta);
    setMonth(date.toISOString().substring(0, 7));
  };

  const currentMonthName = new Date(month + '-01').toLocaleDateString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 lg:p-8 bg-[#FDFBF7] min-h-screen font-jost">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-3xl italic text-black-deep mb-1">My Salary</h1>
            <p className="text-secondary text-sm font-medium tracking-tight">Viewing salary details for {currentMonthName}</p>
          </div>
          
          <div className="flex items-center bg-white border border-gold/20 rounded-xl p-1 shadow-sm">
             <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-gold">
               <ChevronLeft size={18} />
             </button>
             <div className="px-6 font-bold text-xs text-black-deep min-w-[150px] text-center uppercase tracking-[0.15em]">
                {currentMonthName}
             </div>
             <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-gold">
               <ChevronRight size={18} />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
             <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-6"></div>
             <p className="text-secondary font-medium italic text-sm">Fetching API Data...</p>
          </div>
        ) : salaryData ? (
          <div className="space-y-6 animate-in fade-in duration-500">
             {/* Profile & Basic Info Section */}
             <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gold/5 flex items-center justify-center text-gold font-bold text-3xl border border-gold/10 shadow-inner">
                         {salaryData.staffName?.charAt(0) || 'S'}
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-black-deep mb-1">{salaryData.staffName}</h2>
                         <div className="flex flex-wrap gap-3">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                               <Briefcase size={12} className="text-gold" />
                               {salaryData.designation}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                               <Hash size={12} className="text-gold" />
                               ID: {salaryData.staffId}
                            </span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-black-deep rounded-2xl p-6 text-white min-w-[240px] relative overflow-hidden shadow-xl">
                      <p className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 relative z-10">Total Amount</p>
                      <h3 className="text-4xl font-display italic relative z-10">AED {salaryData.totalAmount?.toLocaleString()}</h3>
                      <Wallet className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
                   </div>
                </div>
             </div>

             {/* Detailed Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                      <DollarSign size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Monthly Salary</p>
                      <p className="text-2xl font-bold text-black-deep">AED {salaryData.monthlySalary?.toLocaleString()}</p>
                   </div>
                </div>

                <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shrink-0">
                      <TrendingUp size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Total Commission</p>
                      <p className="text-2xl font-bold text-black-deep">AED {salaryData.totalCommissionEarned?.toLocaleString()}</p>
                   </div>
                </div>

                <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                      <CheckCircle size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Completed Bookings</p>
                      <p className="text-2xl font-bold text-black-deep">{salaryData.completedBookingsCount}</p>
                   </div>
                </div>

                <div className="bg-white rounded-[24px] border border-gold/10 shadow-sm p-6 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-400 border border-purple-100 shrink-0">
                      <Calendar size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Salary Month</p>
                      <p className="text-2xl font-bold text-black-deep uppercase">{salaryData.yearMonth}</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-gold/10 shadow-sm px-6">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar size={40} />
             </div>
             <h3 className="text-xl font-bold text-black-deep mb-2 uppercase tracking-wider">No Records Found</h3>
             <p className="text-secondary max-w-xs mx-auto text-sm italic">No earning records available for {currentMonthName} in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySalary;
