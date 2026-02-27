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

  if (error) return <div className="admin-content text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="page active">
      <div className="admin-page-header">
        <h1>Pending Salons</h1>
        <p>Review and approve salon registration requests.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <select className="admin-filter-select">
            <option>All Submissions</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="admin-toolbar-right">
          <div className="admin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search salons..." />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Salon Name</th>
                <th>City</th>
                <th>Owner ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">Loading pending salons...</td>
                </tr>
              ) : salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No pending salons found.</td>
                </tr>
              ) : (
                salons.map((salon) => (
                  <tr key={salon.id}>
                    <td><strong>{salon.name}</strong></td>
                    <td className="td-muted">{salon.city}</td>
                    <td className="td-mono">{salon.ownerUserId}</td>
                    <td>
                      <span className="status-badge pending">Pending</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="admin-btn admin-btn-green admin-btn-sm"
                          onClick={() => handleVerify(salon.id, 'VERIFIED')}
                          disabled={actionLoading === salon.id}
                        >
                          {actionLoading === salon.id ? "..." : "Approve"}
                        </button>
                        <button 
                          className="admin-btn admin-btn-red admin-btn-sm"
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
          <div className="admin-pagination">
            <span className="page-info">
              Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
            </span>
            <div className="page-btns">
              <button 
                className="page-btn" 
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="page-btn" 
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingSalons;
