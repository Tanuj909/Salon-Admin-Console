import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVerifiedSalonsApi } from "../services/salonService";

const VerifiedSalons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVerifiedSalons();
  }, [currentPage]);

  const fetchVerifiedSalons = async () => {
    try {
      setLoading(true);
      const data = await getVerifiedSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch verified salons");
      console.error(err);
    } finally {
      setLoading(false);
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
      (salon.city && salon.city.toLowerCase().includes(query))
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
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] p-4 sm:p-6">
      <div className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl italic text-black-deep mb-2">Verified Salons</h1>
            <p className="text-secondary text-sm sm:text-base hidden lg:block">All approved and active salons on the platform.</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4 self-start md:self-auto min-w-[150px]">
             <div className="text-[10px] text-secondary font-bold uppercase tracking-widest text-left leading-tight">
                Total<br className="hidden lg:block" /> 
                <span className="lg:hidden text-green-600">Verified</span> 
                <span className="hidden lg:inline text-secondary">Verified</span>
                <span className="block lg:hidden text-green-600 mt-0.5">Approved</span>
             </div>
             <div className="text-2xl sm:text-3xl font-display font-bold text-green-600">{totalElements}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gold/10 bg-[#FDFBF7] flex flex-col sm:flex-row gap-4 justify-end items-center relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-green-500/5 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            </div>
            <div className="relative z-10 w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search verified salons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-black-deep py-2.5 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px] hidden lg:table">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest rounded-tl-2xl">Salon Name</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">City</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Rating</th>
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
                        <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading verified salons...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSalons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                      </div>
                      <p className="text-lg font-bold text-black-deep mb-1">No verified salons</p>
                      <p className="text-sm text-secondary">No verified salons match your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSalons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-black-deep text-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">{salon.name.substring(0, 2).toUpperCase()}</div>
                          {salon.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-secondary font-medium">{salon.city}</td>
                      <td className="py-4 px-6 text-sm font-bold text-black-deep">
                        <div className="flex items-center gap-1 bg-gold/10 px-2 py-0.5 rounded inline-block">
                          <span className="text-gold">★</span> {salon.averageRating.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Verified
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-2 justify-end transition-opacity">
                          <button
                            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                            onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                          >
                            View Details
                          </button>
                          <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* MOBILE CARD VIEW */}
            <div className="lg:hidden divide-y divide-slate-50">
              {loading && salons.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                  <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading verified...</span>
                </div>
              ) : filteredSalons.length === 0 ? (
                <div className="py-24 text-center px-4">
                  <p className="text-lg font-bold text-black-deep mb-1">No verified salons</p>
                </div>
              ) : (
                filteredSalons.map((salon) => (
                  <div key={salon.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {salon.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-black-deep text-[13px] truncate">{salon.name}</span>
                        <div className="flex items-center gap-1 bg-gold/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-black-deep">
                          <span className="text-gold text-[10px]">★</span> {salon.averageRating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-secondary font-medium truncate uppercase tracking-wider">{salon.city}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all shadow-sm"
                          >
                            View
                          </button>
                          <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all">
                            Suspend
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-4 sm:px-6 border-t border-gold/10 bg-[#FDFBF7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-secondary text-xs sm:text-sm font-medium">
                Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
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
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-l border-slate-200 transition-colors ${currentPage === i ? 'bg-gold/10 text-gold' : 'text-slate-600 hover:bg-slate-50'}`}
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

export default VerifiedSalons;
