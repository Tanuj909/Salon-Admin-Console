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
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchVerifiedSalons();
  }, [currentPage]);

  const fetchVerifiedSalons = async () => {
    try {
      setLoading(true);
      const data = await getVerifiedSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
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

  if (loading && salons.length === 0) return <div className="p-8 text-center text-slate-500">Loading verified salons...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Verified Salons</h1>
          <p className="text-slate-500 mt-1">Discover and manage all successfully verified businesses</p>
        </div>
        <button 
          onClick={() => {
            if (currentPage === 0) fetchVerifiedSalons();
            else setCurrentPage(0);
          }}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          title="Refresh"
        >
          🔄
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {salons.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500">
            No verified salons found.
          </div>
        ) : (
          salons.map((salon) => (
            <div key={salon.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-48 bg-slate-100">
                {salon.bannerImageUrl ? (
                  <img src={salon.bannerImageUrl} alt={salon.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl font-bold italic">
                    {salon.name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 shadow-sm">
                  <span>🛡️</span> Verified
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase truncate">
                  {salon.name}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-snug h-10">
                  {salon.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">📍 {salon.city}</span>
                  <span className="flex items-center gap-1">⭐ {salon.averageRating.toFixed(1)}</span>
                  <span className="flex items-center gap-1">🗓️ {salon.serviceCount} Services</span>
                </div>

                <button 
                  onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                  className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all text-center block"
                >
                  View Business Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50"
          >
            ← Prev
          </button>
          <span className="text-slate-600 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifiedSalons;
