import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSalonsApi, verifySalonApi, reverifySuspendedBusinessApi } from "../services/salonService";

const AllSalons = () => {
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
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [actionLoading, setActionLoading] = useState(null);

  const handleVerify = async (id) => {
    if (window.confirm("Are you sure you want to verify this salon?")) {
      try {
        setActionLoading(id);
        await reverifySuspendedBusinessApi(id);
        fetchAllSalons();
      } catch (err) {
        alert("Failed to verify salon. Please try again.");
        console.error(err);
      } finally {
        setActionLoading(null);
      }
    }
  };

  useEffect(() => {
    fetchAllSalons();
  }, [currentPage]);

  const fetchAllSalons = async () => {
    try {
      setLoading(true);
      const data = await getAllSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch salons list");
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> {status}
          </span>
        );
    }
  };

  const filteredSalons = salons.filter((salon) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      salon.name.toLowerCase().includes(query) ||
      (salon.city && salon.city.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All Status" ||
      salon.verificationStatus === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  if (error) return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium flex items-center gap-3 shadow-sm max-w-md">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] p-4 sm:p-6">
      <div className="responsive-container pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 px-1">
          <div>
            <h1 className="text-responsive-h2 font-display italic text-black-deep mb-2 leading-tight">All Salons</h1>
            <p className="text-secondary text-sm sm:text-base hidden lg:block">Complete directory of all registered businesses.</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4 self-start md:self-auto min-w-[150px]">
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest text-left leading-tight">
                Total<br className="hidden lg:block" /> 
                <span className="lg:hidden">Registered</span>
                <span className="hidden lg:inline">Salons</span>
                <span className="block lg:hidden text-black-deep/40 mt-0.5">Businesses</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-black-deep">{totalElements}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-4 py-4 sm:px-6 border-b border-gold/10 bg-[#FDFBF7] flex flex-col lg:flex-row gap-4 justify-between items-center relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-gold/5 pointer-events-none hidden sm:block">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm0 12h16v2H4z" /></svg>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 relative z-10 font-jost">
                <div className="relative group w-full sm:w-64">
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

                <div className="relative w-full sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 px-4 pr-8 rounded-xl font-medium text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-colors cursor-pointer shadow-sm"
                    >
                        <option>All Status</option>
                        <option>Verified</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                        <option>Suspended</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-[800px] hidden lg:table">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Salon Name</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest hidden sm:table-cell">City</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest hidden md:table-cell">Rating</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && salons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                        <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading salons...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSalons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center px-4">
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm0 12h16v2H4z" /></svg>
                      </div>
                      <p className="text-lg font-bold text-black-deep mb-1">No salons discovered</p>
                      <p className="text-sm text-secondary">No salons match your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSalons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-black-deep text-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">{salon.name.substring(0, 2).toUpperCase()}</div>
                          <div className="flex flex-col">
                            <span>{salon.name}</span>
                            <span className="sm:hidden text-[10px] text-secondary font-medium mt-1">{salon.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-sm text-secondary font-medium hidden sm:table-cell">{salon.city}</td>
                      <td className="py-4 px-4 sm:px-6">
                        {getStatusBadge(salon.verificationStatus)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                        <div className="flex items-center gap-1 bg-gold/10 px-2 py-0.5 rounded text-sm font-bold text-black-deep w-fit">
                          <span className="text-gold text-xs">★</span> {salon.averageRating.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-slate-700 hover:text-gold hover:bg-gold/10 hover:border-gold/30 border border-slate-200 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm"
                            onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                          >
                            View Details
                          </button>
                          {salon.verificationStatus === 'SUSPENDED' && (
                            <button
                              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm disabled:opacity-50"
                              onClick={() => handleVerify(salon.id)}
                              disabled={actionLoading === salon.id}
                            >
                              {actionLoading === salon.id ? "..." : "Verify the Salon!"}
                            </button>
                          )}
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
                  <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading salons...</span>
                </div>
              ) : filteredSalons.length === 0 ? (
                <div className="py-24 text-center px-4">
                  <p className="text-lg font-bold text-black-deep mb-1">No salons found</p>
                </div>
              ) : (
                filteredSalons.map((salon) => (
                  <div key={salon.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {salon.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-black-deep text-[13px] truncate">{salon.name}</span>
                        {getStatusBadge(salon.verificationStatus)}
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
                          {salon.verificationStatus === 'SUSPENDED' && (
                            <button 
                              className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
                              onClick={() => handleVerify(salon.id)}
                              disabled={actionLoading === salon.id}
                            >
                              {actionLoading === salon.id ? "..." : "Verify"}
                            </button>
                          )}
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

export default AllSalons;
