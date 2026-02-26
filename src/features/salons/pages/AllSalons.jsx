import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSalonsApi } from "../services/salonService";

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading && salons.length === 0) return <div className="p-8 text-center text-slate-500">Loading salons...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">All Salons</h1>
          <p className="text-slate-500 mt-1">Manage and monitor all registered businesses ({totalElements})</p>
        </div>
        <button 
          onClick={() => {
            if (currentPage === 0) fetchAllSalons();
            else setCurrentPage(0);
          }}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          🔄
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salons.map((salon) => (
                <tr key={salon.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold shrink-0">
                        {salon.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{salon.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{salon.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{salon.city}</div>
                    <div className="text-xs text-slate-400">{salon.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusColor(salon.verificationStatus)}`}>
                      {salon.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <span>⭐</span> {salon.averageRating.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-slate-400">({salon.totalReviews} reviews)</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-slate-500">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSalons;
