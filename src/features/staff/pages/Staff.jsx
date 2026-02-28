import { useState, useEffect } from "react";
import { getStaffByBusinessApi, createStaffApi, updateStaffApi, getStaffByIdApi, deleteStaffApi, assignServicesToStaffApi, removeServicesFromStaffApi } from "../services/staffService";
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

  // Update staff state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    designation: "",
    bio: "",
    commission: 10.0,
    isAvailable: true,
    workStartTime: "09:00",
    workEndTime: "18:00",
    weeklyOffDays: ["SUNDAY"],
    serviceIds: [],
  });
  const [updating, setUpdating] = useState(false);
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

  // Profile view state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Delete staff state
  const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState(null);
  const [deletingStaffName, setDeletingStaffName] = useState("");
  const [deletingStaff, setDeletingStaff] = useState(false);

  const openDeleteStaffModal = (staff) => {
    setDeletingStaffId(staff.id);
    setDeletingStaffName(staff.userFullName);
    setIsDeleteStaffOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaffId) return;
    try {
      setDeletingStaff(true);
      await deleteStaffApi(deletingStaffId);
      setIsDeleteStaffOpen(false);
      setDeletingStaffId(null);
      setDeletingStaffName("");
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error deleting staff", err);
      alert("Failed to delete staff member");
    } finally {
      setDeletingStaff(false);
    }
  };

  // Assign services state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState(null);
  const [assignStaffName, setAssignStaffName] = useState("");
  const [assignSelectedIds, setAssignSelectedIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const openAssignModal = (staff) => {
    setAssignStaffId(staff.id);
    setAssignStaffName(staff.userFullName);
    // Pre-select current services
    const currentIds = staff.specializedServices
      ? staff.specializedServices.map(s => s.id || s)
      : (staff.serviceIds || []);
    setAssignSelectedIds(currentIds);
    setIsAssignOpen(true);
  };

  const toggleAssignService = (id) => {
    setAssignSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAssignServices = async () => {
    if (!assignStaffId) return;
    try {
      setAssigning(true);
      await assignServicesToStaffApi(assignStaffId, assignSelectedIds);
      setIsAssignOpen(false);
      // Refresh profile if open
      if (isProfileOpen && profileData && profileData.id === assignStaffId) {
        const data = await getStaffByIdApi(assignStaffId);
        setProfileData(data.body || data);
      }
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error assigning services", err);
      alert("Failed to assign services");
    } finally {
      setAssigning(false);
    }
  };

  const openProfileModal = async (staff) => {
    try {
      setProfileLoading(true);
      setProfileData(staff); // show basic data immediately
      setIsProfileOpen(true);
      const data = await getStaffByIdApi(staff.id);
      setProfileData(data.body || data);
    } catch (err) {
      console.error("Error fetching staff profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Open update modal pre-filled with selected staff data (fetches fresh data)
  const openUpdateModal = async (staff) => {
    try {
      setEditingStaff(staff);
      setIsUpdateModalOpen(true);
      // Fetch full staff details from the API
      const data = await getStaffByIdApi(staff.id);
      const detail = data.body || data;
      setEditingStaff(detail);
      setUpdateForm({
        designation: detail.designation || "",
        bio: detail.bio || "",
        commission: detail.commission ?? 10.0,
        isAvailable: detail.isAvailable ?? true,
        workStartTime: detail.workStartTime ? detail.workStartTime.slice(0, 5) : "09:00",
        workEndTime: detail.workEndTime ? detail.workEndTime.slice(0, 5) : "18:00",
        weeklyOffDays: detail.weeklyOffDays || ["SUNDAY"],
        serviceIds: detail.specializedServices
          ? detail.specializedServices.map(s => s.id || s)
          : (detail.serviceIds || []),
      });
    } catch (err) {
      console.error("Error fetching staff details", err);
      // Fallback to list data
      setUpdateForm({
        designation: staff.designation || "",
        bio: staff.bio || "",
        commission: staff.commission ?? 10.0,
        isAvailable: staff.isAvailable ?? true,
        workStartTime: staff.workStartTime ? staff.workStartTime.slice(0, 5) : "09:00",
        workEndTime: staff.workEndTime ? staff.workEndTime.slice(0, 5) : "18:00",
        weeklyOffDays: staff.weeklyOffDays || ["SUNDAY"],
        serviceIds: staff.serviceIds || [],
      });
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "serviceIds") {
      const id = parseInt(value);
      setUpdateForm((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(id)
          ? prev.serviceIds.filter((s) => s !== id)
          : [...prev.serviceIds, id],
      }));
    } else if (name === "weeklyOffDays") {
      setUpdateForm((prev) => ({
        ...prev,
        weeklyOffDays: prev.weeklyOffDays.includes(value)
          ? prev.weeklyOffDays.filter((d) => d !== value)
          : [...prev.weeklyOffDays, value],
      }));
    } else {
      setUpdateForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    try {
      setUpdating(true);
      await updateStaffApi(editingStaff.id, {
        ...updateForm,
        workStartTime: updateForm.workStartTime + ":00",
        workEndTime: updateForm.workEndTime + ":00",
      });
      setIsUpdateModalOpen(false);
      setEditingStaff(null);
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error updating staff", err);
      alert("Failed to update staff member");
    } finally {
      setUpdating(false);
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

        .s-actions-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .s-action-view {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action-view:hover {
          border-color: #8B5CF6;
          color: #8B5CF6;
          background: #F5F3FF;
        }

        .s-action-delete {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action-delete:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEF2F2;
        }

        .sd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        .sd-modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          text-align: center;
          overflow: hidden;
        }

        .sd-body {
          padding: 2rem 2rem 1.25rem;
        }

        .sd-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FEF2F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .sd-body h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.4rem;
        }

        .sd-body p {
          font-size: 0.8125rem;
          color: #6B7280;
          line-height: 1.5;
          margin: 0;
        }

        .sd-name {
          font-weight: 600;
          color: #EF4444;
        }

        .sd-actions {
          display: flex;
          gap: 0.625rem;
          padding: 0 2rem 1.75rem;
        }

        .sd-actions button {
          flex: 1;
          padding: 0.65rem;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .sd-cancel {
          background: #F3F4F6;
          color: #6B7280;
        }
        .sd-cancel:hover { background: #E5E7EB; }

        .sd-confirm {
          background: #EF4444;
          color: #fff;
        }
        .sd-confirm:hover { background: #DC2626; }
        .sd-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

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

        /* Profile Modal */
        .sp-overlay {
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

        .sp-modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
        }

        .sp-modal::-webkit-scrollbar { width: 4px; }
        .sp-modal::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .sp-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.5rem 0;
        }

        .sp-avatar {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sp-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .sp-info h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .sp-info .sp-designation {
          font-size: 0.8125rem;
          color: #6B7280;
          margin-top: 0.15rem;
        }

        .sp-info .sp-availability { margin-top: 0.35rem; }

        .sp-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
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

        .sp-close:hover { background: #F3F4F6; color: #111827; }

        .sp-bio {
          padding: 1rem 1.5rem;
          font-size: 0.8125rem;
          color: #6B7280;
          line-height: 1.6;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-stat-item {
          text-align: center;
          padding: 1rem 0.5rem;
          border-right: 1px solid #F3F4F6;
        }

        .sp-stat-item:last-child { border-right: none; }

        .sp-stat-val {
          font-size: 1.3rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .sp-stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.2rem;
        }

        .sp-section {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-section:last-child { border-bottom: none; }

        .sp-section-title {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.75rem;
        }

        .sp-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .sp-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .sp-detail-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: #9CA3AF;
        }

        .sp-detail-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #111827;
        }

        .sp-services-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .sp-svc-tag {
          font-size: 0.75rem;
          font-weight: 500;
          background: #EFF6FF;
          color: #2563EB;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          border: 1px solid #BFDBFE;
        }

        .sp-days-list { display: flex; gap: 0.35rem; }

        .sp-day-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.3rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          color: #6B7280;
          background: #fff;
        }

        .sp-day-tag.off {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #EF4444;
        }

        .sp-loading {
          padding: 3rem;
          text-align: center;
          font-size: 0.8125rem;
          color: #9CA3AF;
        }

        .sp-assign-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border: 1px dashed #93C5FD;
          border-radius: 8px;
          background: #EFF6FF;
          color: #2563EB;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
          justify-content: center;
        }

        .sp-assign-btn:hover {
          background: #DBEAFE;
          border-color: #2563EB;
        }

        .sp-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border: 1px dashed #FECACA;
          border-radius: 8px;
          background: #FEF2F2;
          color: #EF4444;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          flex: 1;
          justify-content: center;
        }

        .sp-remove-btn:hover {
          background: #FEE2E2;
          border-color: #EF4444;
        }

        .sp-service-actions {
          display: flex;
          gap: 0.5rem;
        }

        .sp-assign-btn {
          flex: 1;
        }

        .sp-svc-tag-removable {
          font-size: 0.75rem;
          font-weight: 500;
          background: #EFF6FF;
          color: #2563EB;
          padding: 0.3rem 0.5rem 0.3rem 0.65rem;
          border-radius: 6px;
          border: 1px solid #BFDBFE;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .sp-svc-remove {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #93C5FD;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          font-size: 0.65rem;
          transition: all 0.15s;
        }

        .sp-svc-remove:hover {
          background: #DC2626;
          color: #fff;
        }

        /* Assign Services Modal */
        .sa-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1003;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        .sa-modal {
          background: #fff;
          border-radius: 14px;
          width: 100%;
          max-width: 520px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          overflow: hidden;
        }

        .sa-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .sa-head h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .sa-head p {
          font-size: 0.78rem;
          color: #6B7280;
          margin: 0.15rem 0 0 0;
        }

        .sa-body {
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .sa-body::-webkit-scrollbar { width: 4px; }
        .sa-body::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .sa-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2563EB;
          margin-bottom: 0.75rem;
        }

        .sa-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .sa-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
          background: #fff;
        }

        .sa-item:hover { border-color: #93C5FD; }

        .sa-item.selected {
          border-color: #2563EB;
          background: #EFF6FF;
        }

        .sa-check {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid #D1D5DB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .sa-item.selected .sa-check {
          background: #2563EB;
          border-color: #2563EB;
        }

        .sa-svc-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sa-item.selected .sa-svc-name {
          color: #2563EB;
          font-weight: 600;
        }

        .sa-foot {
          display: flex;
          gap: 0.75rem;
          padding: 1.125rem 1.5rem;
          border-top: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .sa-foot .s-cancel { flex: 1; }
        .sa-foot .s-submit { flex: 2; }
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
                        <div className="s-actions-row">
                          <button className="s-action-view" onClick={() => openProfileModal(staff)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '3px', verticalAlign: '-1px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View
                          </button>
                          <button className="s-action" onClick={() => openUpdateModal(staff)}>Manage</button>
                          <button className="s-action-delete" onClick={() => openDeleteStaffModal(staff)}>Delete</button>
                        </div>
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

      {/* Modal - Update Staff */}
      {isUpdateModalOpen && (
        <div className="s-overlay" onClick={(e) => e.target === e.currentTarget && setIsUpdateModalOpen(false)}>
          <div className="s-modal">
            <div className="s-mhead">
              <div>
                <h2 className="s-mtitle">Update Staff Member</h2>
                <p className="s-msub">Edit {editingStaff?.userFullName}'s details</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsUpdateModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: "contents" }}>
              <div className="s-mbody">
                <div className="s-grid">
                  <div className="s-field s-full">
                    <label className="s-label">Designation</label>
                    <input type="text" name="designation" value={updateForm.designation} onChange={handleUpdateChange} required className="s-input" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="s-field s-full">
                    <label className="s-label">Biography</label>
                    <textarea name="bio" value={updateForm.bio} onChange={handleUpdateChange} className="s-textarea" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Work Hours</label>
                    <div className="s-time-row">
                      <input type="time" name="workStartTime" value={updateForm.workStartTime} onChange={handleUpdateChange} className="s-input" style={{ flex: 1 }} />
                      <span className="s-sep">–</span>
                      <input type="time" name="workEndTime" value={updateForm.workEndTime} onChange={handleUpdateChange} className="s-input" style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="s-field">
                    <label className="s-label">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={updateForm.commission} onChange={handleUpdateChange} className="s-input" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={updateForm.isAvailable}
                    onChange={handleUpdateChange}
                    id="update-available"
                    style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                  />
                  <label htmlFor="update-available" className="s-label" style={{ margin: 0, cursor: 'pointer' }}>Available</label>
                </div>

                <div>
                  <p className="s-sec">Days Off</p>
                  <div className="s-days">
                    {DAYS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleUpdateChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                        className={`s-day ${updateForm.weeklyOffDays.includes(DAYS_FULL[i]) ? "off" : ""}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div>
                    <p className="s-sec">Services {updateForm.serviceIds.length > 0 && <span style={{ color: "#2563EB" }}>({updateForm.serviceIds.length} selected)</span>}</p>
                    <div className="s-svcs">
                      {availableServices.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => handleUpdateChange({ target: { name: "serviceIds", value: svc.id } })}
                          className={`s-svc ${updateForm.serviceIds.includes(svc.id) ? "sel" : ""}`}
                        >
                          {svc.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="s-mfoot">
                <button type="button" className="s-cancel" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                <button type="submit" className="s-submit" disabled={updating}>
                  {updating ? "Updating…" : "Update Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Staff Profile View */}
      {isProfileOpen && (
        <div className="sp-overlay" onClick={(e) => e.target === e.currentTarget && setIsProfileOpen(false)}>
          <div className="sp-modal" style={{ position: 'relative' }}>
            <button className="sp-close" onClick={() => setIsProfileOpen(false)}>✕</button>

            {profileData && (
              <>
                <div className="sp-header">
                  <div className="sp-avatar" style={{ background: '#E8F0FE', color: '#1967D2' }}>
                    {profileData.userProfileImageUrl
                      ? <img src={profileData.userProfileImageUrl} alt={profileData.userFullName} />
                      : getInitials(profileData.userFullName)}
                  </div>
                  <div className="sp-info">
                    <h2>{profileData.userFullName}</h2>
                    <div className="sp-designation">{profileData.designation}</div>
                    <div className="sp-availability">
                      <span className={`s-badge ${profileData.isAvailable ? 'on' : 'off'}`}>
                        <span className="s-dot" />
                        {profileData.isAvailable ? 'Available' : 'Off Duty'}
                      </span>
                    </div>
                  </div>
                </div>

                {profileData.bio && (
                  <div className="sp-bio">{profileData.bio}</div>
                )}

                <div className="sp-stats">
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{(profileData.averageRating ?? 0).toFixed(1)}</div>
                    <div className="sp-stat-label">★ Rating</div>
                  </div>
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{profileData.totalBookings ?? 0}</div>
                    <div className="sp-stat-label">Bookings</div>
                  </div>
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{profileData.totalReviews ?? 0}</div>
                    <div className="sp-stat-label">Reviews</div>
                  </div>
                </div>

                <div className="sp-section">
                  <div className="sp-section-title">Contact Information</div>
                  <div className="sp-detail-grid">
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Email</span>
                      <span className="sp-detail-value">{profileData.userEmail || '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Phone</span>
                      <span className="sp-detail-value">{profileData.userPhoneNumber || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="sp-section">
                  <div className="sp-section-title">Work Schedule</div>
                  <div className="sp-detail-grid">
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Start Time</span>
                      <span className="sp-detail-value">{profileData.workStartTime ? profileData.workStartTime.slice(0, 5) : '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">End Time</span>
                      <span className="sp-detail-value">{profileData.workEndTime ? profileData.workEndTime.slice(0, 5) : '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Commission</span>
                      <span className="sp-detail-value">{profileData.commission ?? 0}%</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Business</span>
                      <span className="sp-detail-value">{profileData.businessName || '—'}</span>
                    </div>
                  </div>
                </div>

                {profileData.weeklyOffDays && profileData.weeklyOffDays.length > 0 && (
                  <div className="sp-section">
                    <div className="sp-section-title">Weekly Off Days</div>
                    <div className="sp-days-list">
                      {DAYS_FULL.map(day => (
                        <span
                          key={day}
                          className={`sp-day-tag ${profileData.weeklyOffDays.includes(day) ? 'off' : ''}`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.specializedServices && profileData.specializedServices.length > 0 && (
                  <div className="sp-section">
                    <div className="sp-section-title">Specialized Services</div>
                    <div className="sp-services-list">
                      {profileData.specializedServices.map(svc => (
                        <span key={svc.id || svc} className="sp-svc-tag-removable">
                          {svc.name || svc}
                          <button
                            className="sp-svc-remove"
                            onClick={() => handleRemoveService(profileData.id, svc.id || svc, svc.name || svc)}
                            title={`Remove ${svc.name || svc}`}
                          >✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Action Buttons */}
                <div className="sp-section" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
                  <div className="sp-service-actions">
                    <button
                      className="sp-assign-btn"
                      onClick={() => openAssignModal(profileData)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      Assign Services
                    </button>
                  </div>
                </div>

                {profileData.createdAt && (
                  <div className="sp-section">
                    <div className="sp-detail-grid">
                      <div className="sp-detail-item">
                        <span className="sp-detail-label">Joined</span>
                        <span className="sp-detail-value">{new Date(profileData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="sp-detail-item">
                        <span className="sp-detail-label">Last Updated</span>
                        <span className="sp-detail-value">{profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {profileLoading && (
              <div className="sp-loading">Loading full profile…</div>
            )}
          </div>
        </div>
      )}

      {/* Modal - Delete Staff Confirmation */}
      {isDeleteStaffOpen && (
        <div className="sd-overlay" onClick={(e) => e.target === e.currentTarget && setIsDeleteStaffOpen(false)}>
          <div className="sd-modal">
            <div className="sd-body">
              <div className="sd-icon">
                <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </div>
              <h3>Delete Staff Member</h3>
              <p>Are you sure you want to remove <span className="sd-name">{deletingStaffName}</span> from your team? This action cannot be undone.</p>
            </div>
            <div className="sd-actions">
              <button className="sd-cancel" onClick={() => setIsDeleteStaffOpen(false)}>Cancel</button>
              <button className="sd-confirm" disabled={deletingStaff} onClick={handleDeleteStaff}>
                {deletingStaff ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Assign Services */}
      {isAssignOpen && (
        <div className="sa-overlay" onClick={(e) => e.target === e.currentTarget && setIsAssignOpen(false)}>
          <div className="sa-modal">
            <div className="sa-head">
              <div>
                <h3>Assign Services</h3>
                <p>Select services for {assignStaffName}</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsAssignOpen(false)}>✕</button>
            </div>
            <div className="sa-body">
              {assignSelectedIds.length > 0 && (
                <div className="sa-count">{assignSelectedIds.length} service{assignSelectedIds.length !== 1 ? 's' : ''} selected</div>
              )}
              <div className="sa-grid">
                {availableServices.map(svc => (
                  <div
                    key={svc.id}
                    className={`sa-item ${assignSelectedIds.includes(svc.id) ? 'selected' : ''}`}
                    onClick={() => toggleAssignService(svc.id)}
                  >
                    <div className="sa-check">
                      {assignSelectedIds.includes(svc.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </div>
                    <span className="sa-svc-name">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sa-foot">
              <button className="s-cancel" onClick={() => setIsAssignOpen(false)}>Cancel</button>
              <button className="s-submit" disabled={assigning} onClick={handleAssignServices}>
                {assigning ? 'Assigning…' : `Assign ${assignSelectedIds.length} Service${assignSelectedIds.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;