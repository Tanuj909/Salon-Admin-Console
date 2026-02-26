import { useState, useEffect } from "react";
import { getPendingSalonsApi, verifySalonApi } from "../services/salonService";

const PendingSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which salon ID is being processed
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchPendingSalons();
  }, [currentPage]);

  const fetchPendingSalons = async () => {
    try {
      setLoading(true);
      const data = await getPendingSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
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
      // Remove the salon from the list or re-fetch
      // For simplicity and to handle pagination correctly after removal, let's re-fetch
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

  if (loading && salons.length === 0) return <div className="p-8 text-center text-slate-500">Loading pending salons...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Pending Verification</h1>
          <p className="text-slate-500 mt-1">Review and approve new salon registrations</p>
        </div>
        <button 
          onClick={() => {
            if (currentPage === 0) fetchPendingSalons();
            else setCurrentPage(0);
          }}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          title="Refresh"
        >
          🔄
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {salons.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
            <span className="text-4xl mb-4 block">✨</span>
            <h3 className="text-slate-900 font-semibold mb-1">All caught up!</h3>
            <p className="text-slate-500">No salons are waiting for verification.</p>
          </div>
        ) : (
          salons.map((salon) => (
            <div key={salon.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex gap-6">
                <div className="w-32 h-32 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-400 text-3xl font-bold">
                  {salon.bannerImageUrl ? (
                    <img src={salon.bannerImageUrl} alt={salon.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    salon.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{salon.name}</h3>
                      <p className="text-slate-500 text-sm mt-1 mb-3 line-clamp-2 leading-relaxed">
                        {salon.description}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100 tracking-wider">
                      {salon.verificationStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      📍 {salon.city}, {salon.country}
                    </span>
                    <span className="flex items-center gap-1.5">
                      ⭐ {salon.averageRating.toFixed(1)} ({salon.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleVerify(salon.id, 'VERIFIED')}
                      disabled={actionLoading === salon.id}
                      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100 disabled:opacity-50"
                    >
                      {actionLoading === salon.id ? "Proccessing..." : "Approve"}
                    </button>
                    <button 
                      onClick={() => handleVerify(salon.id, 'REJECTED')}
                      disabled={actionLoading === salon.id}
                      className="px-5 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
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
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-600 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingSalons;
