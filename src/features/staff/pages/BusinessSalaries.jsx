import React, { useState, useEffect } from 'react';
import { getBusinessSalariesApi } from '../services/staffService';
import { useBusiness } from '@/context/BusinessContext';
import { DollarSign, Calendar, Search, Filter, Download, User } from 'lucide-react';

const BusinessSalaries = () => {
  const { businessId } = useBusiness();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (businessId) fetchSalaries();
  }, [businessId, month]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const data = await getBusinessSalariesApi(businessId, month);
      setSalaries(data.body || data || []);
    } catch (err) {
      console.error("Error fetching business salaries", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaries = salaries.filter(s => 
    s.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayout = salaries.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const handleExport = () => {
    const headers = ['Staff Name', 'Designation', 'Monthly Salary', 'Commission', 'Total Amount', 'Bookings'];
    const csvContent = [
      headers.join(','),
      ...salaries.map(s => [
        s.staffName,
        s.designation,
        s.monthlySalary,
        s.totalCommissionEarned,
        s.totalAmount,
        s.completedBookingsCount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Salaries_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 bg-[#FDFBF7] min-h-screen font-jost font-light">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-2">Staff Salaries</h1>
            <p className="text-secondary text-base">Monthly payroll and commission breakdown for your team</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
                <input 
                  type="month" 
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-4 py-3 bg-white border border-gold/20 rounded-xl text-sm font-bold text-black-deep focus:outline-none focus:ring-2 focus:ring-gold/20 pl-11 shadow-sm cursor-pointer"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
             </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-black-deep rounded-3xl p-8 mb-8 shadow-xl shadow-black-deep/10 relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-gold/80 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Total Monthly Payout</p>
              <h2 className="text-5xl font-display italic text-white mb-6">AED {totalPayout.toLocaleString()}</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                 <div>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Staff Count</p>
                    <p className="text-xl font-bold text-white">{salaries.length}</p>
                 </div>
                 <div>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Period</p>
                    <p className="text-xl font-bold text-white uppercase">{month}</p>
                 </div>
                 <div>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Currency</p>
                    <p className="text-xl font-bold text-gold">AED</p>
                 </div>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-gold/10 flex flex-col sm:flex-row justify-between items-center bg-[#FDFBF7] gap-4">
            <div className="relative w-full sm:w-96">
               <input 
                 type="text" 
                 placeholder="Search staff..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 font-medium shadow-inner"
               />
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest active:scale-95"
            >
               <Download size={14} /> Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-gold/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Staff Member</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-center">Bookings</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Base Salary</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Commission</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Total Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                       <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                       <p className="text-sm text-secondary font-medium italic">Fetching Payroll Data...</p>
                    </td>
                  </tr>
                ) : filteredSalaries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                       <p className="text-sm text-secondary font-medium">No salary records found for this period.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSalaries.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs shrink-0 border border-gold/20 shadow-inner">
                               {s.staffName?.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-black-deep text-sm group-hover:text-gold transition-colors">{s.staffName}</div>
                               <div className="text-[11px] text-secondary font-medium uppercase tracking-tight italic">ID: #{s.staffId} | {s.designation}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-100">
                            {s.completedBookingsCount}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600 text-sm">
                         AED {s.monthlySalary?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600 text-sm">
                         AED {s.totalCommissionEarned?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="font-bold text-black-deep text-md italic">AED {s.totalAmount?.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSalaries;
