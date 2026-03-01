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

  if (error) return <div className="admin-content text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex flex-col border-b border-gold/10">
        <h1 className="font-display text-4xl italic text-black-deep">Verified Salons</h1>
        <p className="text-secondary text-sm mt-2 font-medium">All approved and active salons on the platform.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <select className="admin-filter-select">
            <option>All Cities</option>
            <option>Dubai</option>
            <option>Mumbai</option>
            <option>Riyadh</option>
            <option>Delhi</option>
          </select>
        </div>
        <div className="admin-toolbar-right">
          <div className="admin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search verified salons..." />
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
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">Loading verified salons...</td>
                </tr>
              ) : salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No verified salons found.</td>
                </tr>
              ) : (
                salons.map((salon) => (
                  <tr key={salon.id}>
                    <td><strong>{salon.name}</strong></td>
                    <td className="td-muted">{salon.city}</td>
                    <td className="td-muted">⭐ {salon.averageRating.toFixed(1)}</td>
                    <td>
                      <span className="status-badge verified">Verified</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                        >
                          View Details
                        </button>
                        <button className="admin-btn admin-btn-red admin-btn-sm">Suspend</button>
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

export default VerifiedSalons;
