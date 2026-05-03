import React, { useState, useEffect } from 'react';
import { getBusinessSalariesApi } from '../services/staffService';
import { useBusiness } from '@/context/BusinessContext';
import { DollarSign, Calendar, Search, Filter, User, Users, Briefcase, Eye, X, TrendingUp, CheckCircle } from 'lucide-react';

const BusinessSalaries = () => {
  const { businessId } = useBusiness();
  const years = Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i);
  const monthsList = [
    { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
    { val: 4, name: 'April' }, { val: 5, name: 'May' }, { val: 6, name: 'June' },
    { val: 7, name: 'July' }, { val: 8, name: 'August' }, { val: 9, name: 'September' },
    { val: 10, name: 'October' }, { val: 11, name: 'November' }, { val: 12, name: 'December' }
  ];
  
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (businessId) fetchSalaries();
  }, [businessId, year, month]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
      const data = await getBusinessSalariesApi(businessId, yearMonth);
      setSalaries(data.body || data || []);
    } catch (err) {
      console.error("Error fetching business salaries", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaries = salaries.filter(s => s.staffName?.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPayout = salaries.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="p-4 lg:p-8 bg-[#FDFBF7] min-h-screen font-jost">
      <div className="max-w-[1600px] mx-auto">
        {/* Header and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 px-2">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-1 text-center lg:text-left">Staff Payroll</h1>
            <p className="text-secondary text-sm font-medium hidden lg:block">Detailed salary breakdown for your salon team</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4">
             {/* Stats Inline - Hidden on Mobile */}
             <div className="hidden sm:flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-gold/10 shadow-sm">
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Total Payout</span>
                   <span className="text-xl font-display italic text-black-deep">AED {totalPayout.toLocaleString()}</span>
                </div>
                <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Team Size</span>
                   <span className="text-xl font-bold text-black-deep">{salaries.length} Staff</span>
                </div>
             </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-[24px] lg:rounded-[32px] shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-4 lg:px-8 py-4 lg:py-6 border-b border-gold/10 flex flex-col lg:flex-row justify-between items-center bg-[#FDFBF7] gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-80">
                  <input 
                    type="text" 
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-white border border-slate-200 rounded-xl lg:rounded-2xl text-sm focus:outline-none focus:border-gold/50 font-medium shadow-inner"
                  />
                  <Search className="absolute left-3.5 lg:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
               
               {/* Desktop Filters */}
               <div className="hidden lg:flex items-center gap-3">
                  

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                     <select 
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="px-3 py-2 bg-transparent text-sm font-bold text-black-deep focus:outline-none cursor-pointer"
                     >
                        {monthsList.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                     </select>
                     <div className="w-px h-6 bg-slate-100" />
                     <select 
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="px-3 py-2 bg-transparent text-sm font-bold text-black-deep focus:outline-none cursor-pointer"
                     >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                     </select>
                  </div>
               </div>

               {/* Mobile Filter Toggle */}
               <button 
                 onClick={() => setShowMonthPicker(!showMonthPicker)}
                 className={`lg:hidden p-2.5 rounded-xl border transition-all ${showMonthPicker ? 'bg-gold border-gold text-white' : 'bg-white border-slate-200 text-slate-600'}`}
               >
                 <Filter size={20} />
               </button>
            </div>

            {/* Mobile Filter Expansion */}
            {showMonthPicker && (
              <div className="w-full lg:hidden animate-in slide-in-from-top-2 duration-200 flex flex-col gap-3">
                <div className="flex gap-2">
                   <select 
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="flex-[2] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-black-deep focus:outline-none"
                   >
                      {monthsList.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                   </select>
                   <select 
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-black-deep focus:outline-none"
                   >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                </div>
                
              </div>
            )}
            
            <div className="hidden lg:flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
               <Filter size={14} className="text-gold" /> Results: {filteredSalaries.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-left border-collapse hidden lg:table">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-gold/10">
                  <th className="px-8 py-5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Team Member</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-center">Services</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Basic Pay</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Commission</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                       <p className="text-sm text-secondary font-bold uppercase tracking-[0.2em]">Syncing Payroll...</p>
                    </td>
                  </tr>
                ) : filteredSalaries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <User size={32} />
                       </div>
                       <p className="text-sm text-secondary font-bold uppercase tracking-widest">No salary records found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSalaries.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div>
                               <div className="font-bold text-black-deep text-base group-hover:text-gold transition-colors">{s.staffName}</div>
                               <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">{s.designation}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[11px] font-extrabold border border-blue-100">
                            {s.completedBookingsCount} Completed Bookings
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-slate-700 text-sm">
                         AED {s.monthlySalary?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-emerald-600 text-sm">
                         + AED {s.totalCommissionEarned?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="font-display italic text-black-deep text-xl">AED {s.totalAmount?.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile List View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {loading ? (
                <div className="py-20 text-center">
                   <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto"></div>
                </div>
              ) : filteredSalaries.length === 0 ? (
                <div className="py-20 text-center text-secondary font-bold text-xs uppercase tracking-widest">No records found</div>
              ) : (
                filteredSalaries.map((s, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-black-deep text-sm">{s.staffName}</h4>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter italic">{s.designation}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedStaff(s)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-black-deep text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4 lg:hidden" onClick={() => setSelectedStaff(null)}>
          <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="font-display text-2xl italic text-black-deep m-0">Payroll Detail</h3>
              <button onClick={() => setSelectedStaff(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-1 border-b border-gold/5 pb-4">
                  <h4 className="font-display text-black-deep text-2xl italic leading-tight">{selectedStaff.staffName}</h4>
                  <p className="text-[10px] text-secondary font-black uppercase tracking-widest">{selectedStaff.designation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1">Basic Pay</p>
                  <p className="font-bold text-black-deep text-md">AED {selectedStaff.monthlySalary?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1">Commission</p>
                  <p className="font-bold text-emerald-600 text-md">AED {selectedStaff.totalCommissionEarned?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5">Bookings</p>
                    <p className="font-bold text-black-deep text-md">{selectedStaff.completedBookingsCount}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5">Period</p>
                    <p className="font-bold text-black-deep text-xs uppercase">{selectedStaff.yearMonth}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black-deep p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Net Total Payout</p>
                  <h3 className="text-3xl font-display italic text-white">AED {selectedStaff.totalAmount?.toLocaleString()}</h3>
                </div>
                <DollarSign className="absolute -right-4 -bottom-4 text-white/5 w-20 h-20 rotate-12" />
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setSelectedStaff(null)}
                className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSalaries;
