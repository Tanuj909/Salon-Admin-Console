import { useState, useEffect } from "react";
import { getPendingSalonsApi, verifySalonApi } from "../services/salonService";

const PendingSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPendingSalons();
  }, [currentPage]);

  const fetchPendingSalons = async () => {
    try {
      setLoading(true);
      const data = await getPendingSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch pending salons");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      setActionLoading(id);
      await verifySalonApi(id, status);
      fetchPendingSalons();
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} salon. Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredSalons = salons.filter((salon) => {
    const query = searchQuery.toLowerCase();
    return (
      salon.name.toLowerCase().includes(query) ||
      (salon.city && salon.city.toLowerCase().includes(query)) ||
      (salon.ownerUserId && salon.ownerUserId.toString().toLowerCase().includes(query))
    );
  });

  if (error) return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium flex items-center gap-3 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
      <div className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-2">Pending Salons</h1>
            <p className="text-secondary text-base">Review and approve salon registration requests.</p>
          </div>
          <div className="text-right bg-white px-6 py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4 hidden md:flex">
            <div className="text-xs text-secondary font-bold uppercase tracking-widest text-left">Total<br />Pending</div>
            <div className="text-3xl font-display font-bold text-gold">{totalElements}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gold/10 bg-[#FDFBF7] flex flex-col sm:flex-row gap-4 justify-between items-center relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-gold/5 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
            </div>
            <div className="relative z-10 w-full sm:w-auto">
              <select className="w-full sm:w-48 appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-xl font-medium text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-colors cursor-pointer shadow-sm">
                <option>All Submissions</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="relative z-10 w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search salons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-black-deep py-2.5 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest rounded-tl-2xl">Salon Name</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">City</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Owner ID</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && salons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                        <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading pending requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSalons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </div>
                      <p className="text-lg font-bold text-black-deep mb-1">No pending request</p>
                      <p className="text-sm text-secondary">No pending salons match your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSalons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-black-deep text-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs shrink-0">{salon.name.substring(0, 2).toUpperCase()}</div>
                          {salon.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-secondary font-medium">{salon.city}</td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded inline-block mt-3 ml-6">{salon.ownerUserId}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Check
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                            onClick={() => handleVerify(salon.id, 'VERIFIED')}
                            disabled={actionLoading === salon.id}
                          >
                            {actionLoading === salon.id ? "..." : "Approve"}
                          </button>
                          <button
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                            onClick={() => handleVerify(salon.id, 'REJECTED')}
                            disabled={actionLoading === salon.id}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gold/10 bg-[#FDFBF7] flex items-center justify-between">
              <span className="text-secondary text-sm font-medium">
                Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
              </span>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 text-sm font-medium border-l border-slate-200 transition-colors ${currentPage === i ? 'bg-gold/10 text-gold' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-200 disabled:opacity-30"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingSalons;
