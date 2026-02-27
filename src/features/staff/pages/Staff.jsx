import { useState, useEffect } from "react";
import { getStaffByBusinessApi, createStaffApi } from "../services/staffService";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getServicesByBusinessApi } from "@/features/services/services/serviceService";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);

  const [form, setForm] = useState({
    designation: "",
    bio: "",
    commission: 10.0,
    isAvailable: true,
    workStartTime: "09:00",
    workEndTime: "18:00",
    weeklyOffDays: ["SUNDAY"],
    role: "STAFF",
    userId: "",
    serviceIds: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { fetchStaffAndBusiness(); }, [currentPage]);

  const fetchStaffAndBusiness = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
        const servicesData = await getServicesByBusinessApi(bId, 0, 100);
        setAvailableServices(servicesData.content || []);
      }
      const data = await getStaffByBusinessApi(bId, currentPage, 10);
      setStaffList(data.body?.content || data.content || []);
      setTotalPages(data.body?.totalPages || data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching staff", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "serviceIds") {
      const id = parseInt(value);
      setForm((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(id)
          ? prev.serviceIds.filter((s) => s !== id)
          : [...prev.serviceIds, id],
      }));
    } else if (name === "weeklyOffDays") {
      setForm((prev) => ({
        ...prev,
        weeklyOffDays: prev.weeklyOffDays.includes(value)
          ? prev.weeklyOffDays.filter((d) => d !== value)
          : [...prev.weeklyOffDays, value],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createStaffApi({
        ...form,
        userId: parseInt(form.userId),
        workStartTime: form.workStartTime + ":00",
        workEndTime: form.workEndTime + ":00",
      });
      setIsModalOpen(false);
      setForm({ designation: "", bio: "", commission: 10.0, isAvailable: true, workStartTime: "09:00", workEndTime: "18:00", weeklyOffDays: ["SUNDAY"], role: "STAFF", userId: "", serviceIds: [] });
      fetchStaffAndBusiness();
    } catch (err) {
      alert("Failed to create staff member");
    } finally {
      setSubmitting(false);
    }
  };

  const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const DAYS_FULL = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  const AVATAR_COLORS = ["#E8F0FE","#E6F4EA","#FEF3E2","#FCE8E6","#F3E8FD","#E8F5E9","#FFF3E0"];
  const AVATAR_TEXT = ["#1967D2","#1E8E3E","#E37400","#D93025","#8430CE","#1B5E20","#E65100"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .s-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F8F9FB;
          min-height: 100vh;
          padding: 2rem 2.5rem;
          color: #111827;
        }

        .s-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .s-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.2rem 0;
          letter-spacing: -0.02em;
        }

        .s-subtitle {
          font-size: 0.8125rem;
          color: #6B7280;
          margin: 0;
        }

        .s-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #2563EB;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.625rem 1.125rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
        }

        .s-btn-primary:hover {
          background: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37,99,235,0.28);
        }

        /* Stats */
        .s-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .s-stat {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 1.1rem 1.25rem;
        }

        .s-stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.4rem;
        }

        .s-stat-val {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .s-stat-sub {
          font-size: 0.72rem;
          color: #9CA3AF;
          margin-top: 0.3rem;
        }

        /* Table card */
        .s-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
        }

        .s-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .s-card-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
        }

        .s-card-count {
          font-size: 0.75rem;
          color: #9CA3AF;
          background: #F3F4F6;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 500;
        }

        table { width: 100%; border-collapse: collapse; }

        th {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          padding: 0.75rem 1.25rem;
          text-align: left;
          background: #FAFAFA;
          border-bottom: 1px solid #F3F4F6;
        }

        td {
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #F9FAFB;
          font-size: 0.8125rem;
          vertical-align: middle;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #FAFAFA; }

        .s-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .s-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
        }

        .s-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .s-name { font-weight: 600; color: #111827; line-height: 1.3; }
        .s-role { font-size: 0.75rem; color: #6B7280; margin-top: 0.1rem; }

        .s-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          color: #111827;
        }

        .s-star { color: #F59E0B; font-size: 0.8rem; }

        .s-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
        }

        .s-dot { width: 5px; height: 5px; border-radius: 50%; }

        .s-badge.on { background: #DCFCE7; color: #16A34A; }
        .s-badge.on .s-dot { background: #16A34A; }
        .s-badge.off { background: #F3F4F6; color: #6B7280; }
        .s-badge.off .s-dot { background: #9CA3AF; }

        .s-action {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action:hover {
          border-color: #2563EB;
          color: #2563EB;
          background: #EFF6FF;
        }

        /* Empty & Loading */
        .s-empty {
          padding: 4rem 2rem;
          text-align: center;
        }

        .s-empty-icon {
          width: 48px;
          height: 48px;
          background: #F3F4F6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .s-empty-h { font-weight: 600; color: #374151; margin-bottom: 0.35rem; font-size: 0.9rem; }
        .s-empty-p { font-size: 0.8125rem; color: #9CA3AF; margin-bottom: 1.25rem; }

        .s-loading {
          padding: 4rem;
          text-align: center;
          font-size: 0.8125rem;
          color: #9CA3AF;
        }

        /* Pagination */
        .s-pager {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.3rem;
          padding: 0.875rem 1.25rem;
          border-top: 1px solid #F3F4F6;
        }

        .s-pg {
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          background: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-pg:hover, .s-pg.active {
          background: #2563EB;
          border-color: #2563EB;
          color: #fff;
        }

        /* MODAL */
        .s-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        @keyframes sfo { from { opacity: 0; } to { opacity: 1; } }

        .s-modal {
          background: #fff;
          border-radius: 14px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          overflow: hidden;
        }

        @keyframes ssu {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .s-mhead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .s-mtitle { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
        .s-msub { font-size: 0.78rem; color: #6B7280; margin: 0.15rem 0 0 0; }

        .s-xbtn {
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          background: none;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          transition: all 0.15s;
        }

        .s-xbtn:hover { background: #F3F4F6; color: #111827; }

        .s-mbody {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .s-mbody::-webkit-scrollbar { width: 4px; }
        .s-mbody::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .s-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .s-full { grid-column: 1 / -1; }

        .s-field { display: flex; flex-direction: column; gap: 0.35rem; }

        .s-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .s-input, .s-textarea {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0.6rem 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
          box-sizing: border-box;
        }

        .s-input:focus, .s-textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .s-input::placeholder, .s-textarea::placeholder { color: #9CA3AF; }
        .s-textarea { resize: none; height: 72px; }

        .s-sec {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.625rem;
        }

        .s-days { display: flex; gap: 0.4rem; flex-wrap: wrap; }

        .s-day {
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          background: #fff;
          padding: 0.375rem 0.65rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-day.off {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #EF4444;
        }

        .s-svcs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.5rem;
        }

        .s-svc {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
          background: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .s-svc:hover { border-color: #93C5FD; }

        .s-svc.sel {
          border-color: #2563EB;
          background: #EFF6FF;
          color: #2563EB;
          font-weight: 600;
        }

        .s-mfoot {
          display: flex;
          gap: 0.75rem;
          padding: 1.125rem 1.5rem;
          border-top: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .s-cancel {
          flex: 1;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          padding: 0.7rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-cancel:hover { background: #F9FAFB; }

        .s-submit {
          flex: 2;
          border: none;
          border-radius: 8px;
          background: #2563EB;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          padding: 0.7rem;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
        }

        .s-submit:hover:not(:disabled) {
          background: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37,99,235,0.28);
        }

        .s-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .s-time-row { display: flex; align-items: center; gap: 0.5rem; }
        .s-sep { color: #9CA3AF; font-size: 0.8rem; flex-shrink: 0; }
      `}</style>

      <div className="s-root">
        <div className="s-header">
          <div>
            <h1 className="s-title">Staff Management</h1>
            <p className="s-subtitle">Manage your team of professional service providers</p>
          </div>
          <button className="s-btn-primary" onClick={() => setIsModalOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Team Member
          </button>
        </div>

        <div className="s-card">
          <div className="s-card-header">
            <span className="s-card-title">Team Members</span>
            {!loading && <span className="s-card-count">{staffList.length} members</span>}
          </div>

          {loading && staffList.length === 0 ? (
            <div className="s-loading">Loading team members…</div>
          ) : staffList.length === 0 ? (
            <div className="s-empty">
              <div className="s-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p className="s-empty-h">No staff members yet</p>
              <p className="s-empty-p">Add your first team member to get started.</p>
              <button className="s-btn-primary" onClick={() => setIsModalOpen(true)}>Add Team Member</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Bookings</th>
                  <th>Reviews</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, i) => {
                  const ci = i % AVATAR_COLORS.length;
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="s-name-cell">
                          <div className="s-avatar" style={{ background: AVATAR_COLORS[ci], color: AVATAR_TEXT[ci] }}>
                            {staff.userProfileImageUrl
                              ? <img src={staff.userProfileImageUrl} alt={staff.userFullName} />
                              : getInitials(staff.userFullName)}
                          </div>
                          <div>
                            <div className="s-name">{staff.userFullName}</div>
                            <div className="s-role">{staff.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="s-rating">
                          <span className="s-star">★</span>
                          {(staff.averageRating ?? 0).toFixed(1)}
                        </div>
                      </td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.totalBookings ?? 0}</td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.totalReviews ?? 0}</td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.serviceCount}</td>
                      <td>
                        <span className={`s-badge ${staff.isAvailable ? "on" : "off"}`}>
                          <span className="s-dot" />
                          {staff.isAvailable ? "Available" : "Off Duty"}
                        </span>
                      </td>
                      <td>
                        <button className="s-action">Manage</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="s-pager">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`s-pg ${i === currentPage ? "active" : ""}`} onClick={() => setCurrentPage(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="s-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="s-modal">
            <div className="s-mhead">
              <div>
                <h2 className="s-mtitle">Add Team Member</h2>
                <p className="s-msub">Register a new professional service provider</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "contents" }}>
              <div className="s-mbody">
                <div className="s-grid">
                  <div className="s-field">
                    <label className="s-label">User ID</label>
                    <input type="number" name="userId" value={form.userId} onChange={handleChange} required className="s-input" placeholder="e.g. 4" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Designation</label>
                    <input type="text" name="designation" value={form.designation} onChange={handleChange} required className="s-input" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="s-field s-full">
                    <label className="s-label">Biography</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="s-textarea" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Work Hours</label>
                    <div className="s-time-row">
                      <input type="time" name="workStartTime" value={form.workStartTime} onChange={handleChange} className="s-input" style={{ flex: 1 }} />
                      <span className="s-sep">–</span>
                      <input type="time" name="workEndTime" value={form.workEndTime} onChange={handleChange} className="s-input" style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="s-field">
                    <label className="s-label">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={form.commission} onChange={handleChange} className="s-input" />
                  </div>
                </div>

                <div>
                  <p className="s-sec">Days Off</p>
                  <div className="s-days">
                    {DAYS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                        className={`s-day ${form.weeklyOffDays.includes(DAYS_FULL[i]) ? "off" : ""}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div>
                    <p className="s-sec">Services {form.serviceIds.length > 0 && <span style={{ color: "#2563EB" }}>({form.serviceIds.length} selected)</span>}</p>
                    <div className="s-svcs">
                      {availableServices.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => handleChange({ target: { name: "serviceIds", value: svc.id } })}
                          className={`s-svc ${form.serviceIds.includes(svc.id) ? "sel" : ""}`}
                        >
                          {svc.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="s-mfoot">
                <button type="button" className="s-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="s-submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;