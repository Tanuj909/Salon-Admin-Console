import { useState, useEffect } from "react";
import { getStaffByBusinessApi, createStaffApi, updateStaffApi, getStaffByIdApi, deleteStaffApi, assignServicesToStaffApi, removeServicesFromStaffApi, generateStaffSlotsApi, getStaffSlotsApi } from "@/features/staff/services/staffService";
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
    workStartTime: "10:00",
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

  // Slot generation state
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({
    staffId: "",
    duration: 1, // months
  });
  const [generatingSlots, setGeneratingSlots] = useState(false);
  const [fetchedSlots, setFetchedSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [showGenerateUI, setShowGenerateUI] = useState(false);
  const [slotStaffName, setSlotStaffName] = useState("");

  const handleGenerateSlots = async () => {
    if (!slotForm.staffId) {
      alert("Please select a staff member");
      return;
    }

    try {
      setGeneratingSlots(true);

      const fromDate = new Date();
      const toDate = new Date();
      toDate.setMonth(fromDate.getMonth() + parseInt(slotForm.duration));

      const formatDate = (date) => date.toISOString().split('T')[0];

      await generateStaffSlotsApi(
        slotForm.staffId,
        formatDate(fromDate),
        formatDate(toDate)
      );

      alert("Slots generated successfully!");
      setIsSlotModalOpen(false);
      setSlotForm({ staffId: "", duration: 1 });
    } catch (err) {
      console.error("Error generating slots", err);
      alert(err.response?.data?.message || "Failed to generate slots. Please try again.");
    } finally {
      setGeneratingSlots(false);
    }
  };

  const openSlotModal = async (staff) => {
    setSlotForm({ staffId: staff.id, duration: 1 });
    setSlotStaffName(staff.userFullName);
    setFetchedSlots([]);
    setShowGenerateUI(false);
    setIsSlotModalOpen(true);

    try {
      setSlotLoading(true);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const data = await getStaffSlotsApi(
        staff.id,
        formatDate(today),
        formatDate(nextWeek)
      );

      const slots = data.body || data || [];
      setFetchedSlots(slots);

      if (slots.length === 0) {
        setShowGenerateUI(true);
      }
    } catch (err) {
      console.error("Error fetching slots", err);
      // Fallback to generate UI if fetch fails
      setShowGenerateUI(true);
    } finally {
      setSlotLoading(false);
    }
  };

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

  const openUpdateModal = async (staff) => {
    setEditingStaff(staff);
    setUpdateForm({
      designation: staff.designation || "",
      bio: staff.bio || "",
      commission: staff.commission || 10.0,
      isAvailable: staff.isAvailable ?? true,
      workStartTime: staff.workStartTime ? staff.workStartTime.substring(0, 5) : "09:00",
      workEndTime: staff.workEndTime ? staff.workEndTime.substring(0, 5) : "18:00",
      weeklyOffDays: staff.weeklyOffDays || ["SUNDAY"],
      serviceIds: staff.specializedServices ? staff.specializedServices.map(s => s.id || s) : [],
    });
    setIsUpdateModalOpen(true);

    try {
      const data = await getStaffByIdApi(staff.id);
      const fullStaff = data.body || data;
      setUpdateForm(prev => ({
        ...prev,
        serviceIds: fullStaff.specializedServices ? fullStaff.specializedServices.map(s => s.id || s) : prev.serviceIds,
        weeklyOffDays: fullStaff.weeklyOffDays || prev.weeklyOffDays,
      }));
    } catch (err) {
      console.error("Error fetching full staff details for update", err);
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
        workStartTime: updateForm.workStartTime.length === 5 ? updateForm.workStartTime + ":00" : updateForm.workStartTime,
        workEndTime: updateForm.workEndTime.length === 5 ? updateForm.workEndTime + ":00" : updateForm.workEndTime,
      });
      setIsUpdateModalOpen(false);
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error updating staff", err);
      alert("Failed to update staff member");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveService = async (staffId, serviceId, filterName) => {
    if (!window.confirm(`Are you sure you want to unassign ${filterName}?`)) return;
    try {
      await removeServicesFromStaffApi(staffId, [serviceId]);
      if (isProfileOpen && profileData && profileData.id === staffId) {
        setProfileData(prev => ({
          ...prev,
          specializedServices: prev.specializedServices.filter(s => (s.id || s) !== serviceId)
        }));
      }
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error removing service", err);
      alert("Failed to remove service");
    }
  };

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const DAYS_FULL = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const AVATAR_COLORS = ["#EFF6FF", "#FEF2F2", "#F0FDF4", "#FFFBEB", "#F5F3FF", "#FDF4FF"];
  const AVATAR_TEXT = ["#2563EB", "#DC2626", "#16A34A", "#D97706", "#7C3AED", "#C026D3"];

  const getInitials = (name) => {
    if (!name) return "S";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
      <div className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-2">Staff Management</h1>
            <p className="text-secondary text-base">Manage your team of professional service providers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="px-6 py-3 bg-gold text-black-deep font-bold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all flex items-center justify-center gap-2 tracking-wide whitespace-nowrap"
              onClick={() => setIsModalOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Team Member
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
            <span className="font-bold text-black-deep text-lg uppercase tracking-wider text-[12px]">Team Members</span>
            {!loading && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{staffList.length} members</span>}
          </div>

          {loading && staffList.length === 0 ? (
            <div className="py-20 text-center text-secondary flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <span>Loading team members...</span>
            </div>
          ) : staffList.length === 0 ? (
            <div className="py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-lg font-bold text-black-deep mb-2">No staff members yet</p>
              <p className="text-secondary max-w-sm mx-auto mb-6">Add your first team member to start managing their services and bookings.</p>
              <button
                className="px-6 py-2.5 bg-black-deep text-white font-bold rounded-xl hover:bg-black transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Add Team Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FDFBF7] border-b border-gold/10">
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Team Member</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-center">Stats</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staffList.map((staff, i) => {
                    const ci = i % AVATAR_COLORS.length;
                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 shadow-sm" style={{ background: AVATAR_COLORS[ci], color: AVATAR_TEXT[ci] }}>
                              {staff.userProfileImageUrl
                                ? <img src={staff.userProfileImageUrl} alt={staff.userFullName} className="w-full h-full object-cover" />
                                : getInitials(staff.userFullName)}
                            </div>
                            <div>
                              <div className="font-bold text-black-deep text-sm group-hover:text-gold transition-colors cursor-pointer" onClick={() => openProfileModal(staff)}>
                                {staff.userFullName}
                              </div>
                              <div className="text-[11px] text-secondary font-medium tracking-wide">{staff.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${staff.isAvailable ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                            <span className={`w-1 h-1 rounded-full ${staff.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                            {staff.isAvailable ? "Available" : "Off Duty"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-4 text-[11px]">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-black-deep">{staff.totalBookings ?? 0}</span>
                              <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Bookings</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-black-deep">★ {(staff.averageRating ?? 0).toFixed(1)}</span>
                              <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Rating</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-black-deep">{staff.serviceCount ?? 0}</span>
                              <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Services</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title="Generate Slots"
                              className="p-2 bg-gold/10 text-gold border border-gold/20 rounded-lg hover:bg-gold/20 transition-all"
                              onClick={() => openSlotModal(staff)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </button>
                            <button
                              title="View Profile"
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-100 transition-colors"
                              onClick={() => openProfileModal(staff)}
                            >
                              View
                            </button>
                            <button
                              title="Manage Details"
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase hover:border-gold hover:text-gold hover:bg-gold/5 transition-colors"
                              onClick={() => openUpdateModal(staff)}
                            >
                              Manage
                            </button>
                            <button
                              title="Delete Staff"
                              className="p-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                              onClick={() => openDeleteStaffModal(staff)}
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gold/10 bg-[#FDFBF7] flex items-center justify-between">
              <div className="text-secondary text-sm font-medium">Showing page {currentPage + 1} of {totalPages}</div>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 text-sm font-medium border-l first:border-l-0 border-slate-200 transition-colors ${i === currentPage ? "bg-gold/10 text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
              <div>
                <h2 className="font-display text-2xl italic text-black-deep m-0">Add Team Member</h2>
                <p className="text-sm text-secondary mt-1">Register a new professional service provider</p>
              </div>
              <button className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors" onClick={() => setIsModalOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
              <div className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">User ID</label>
                    <input type="number" name="userId" value={form.userId} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep" placeholder="e.g. 4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Designation</label>
                    <input type="text" name="designation" value={form.designation} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Biography</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full h-24 resize-none px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep placeholder:text-slate-400" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Work Hours</label>
                    <div className="flex items-center gap-2">
                      <input type="time" name="workStartTime" value={form.workStartTime} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-all" />
                      <span className="text-secondary">-</span>
                      <input type="time" name="workEndTime" value={form.workEndTime} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={form.commission} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep" />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Days Off</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d, i) => {
                      const isOff = form.weeklyOffDays.includes(DAYS_FULL[i]);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                          className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors ${isOff ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 flex items-center justify-between">
                      Services
                      {form.serviceIds.length > 0 && <span className="text-gold bg-gold/10 px-2 py-0.5 rounded text-[9px]">{form.serviceIds.length} Selected</span>}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableServices.map((svc) => {
                        const isSel = form.serviceIds.includes(svc.id);
                        return (
                          <div
                            key={svc.id}
                            onClick={() => handleChange({ target: { name: "serviceIds", value: svc.id } })}
                            className={`cursor-pointer px-3 py-2 text-xs font-medium rounded-lg border transition-all truncate text-center ${isSel ? "border-gold bg-gold/5 text-black-deep" : "bg-white border-slate-200 text-slate-600 hover:border-gold/40"}`}
                            title={svc.name}
                          >
                            {svc.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button type="button" className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-black-deep bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50" disabled={submitting}>
                  {submitting ? "Saving…" : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Update Staff */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsUpdateModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
              <div>
                <h2 className="font-display text-2xl italic text-black-deep m-0">Update Staff Member</h2>
                <p className="text-sm text-secondary mt-1">Edit {editingStaff?.userFullName}'s details</p>
              </div>
              <button className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors" onClick={() => setIsUpdateModalOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
              <div className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Designation</label>
                    <input type="text" name="designation" value={updateForm.designation} onChange={handleUpdateChange} required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Biography</label>
                    <textarea name="bio" value={updateForm.bio} onChange={handleUpdateChange} className="w-full h-24 resize-none px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep placeholder:text-slate-400" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Work Hours</label>
                    <div className="flex items-center gap-2">
                      <input type="time" name="workStartTime" value={updateForm.workStartTime} onChange={handleUpdateChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-all" />
                      <span className="text-secondary">-</span>
                      <input type="time" name="workEndTime" value={updateForm.workEndTime} onChange={handleUpdateChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={updateForm.commission} onChange={handleUpdateChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep" />
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={updateForm.isAvailable}
                    onChange={handleUpdateChange}
                    id="update-available"
                    className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <label htmlFor="update-available" className="text-sm font-bold text-black-deep cursor-pointer pt-0.5">Currently Available for Bookings</label>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Days Off</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d, i) => {
                      const isOff = updateForm.weeklyOffDays.includes(DAYS_FULL[i]);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleUpdateChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                          className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors ${isOff ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 flex items-center justify-between">
                      Services
                      {updateForm.serviceIds.length > 0 && <span className="text-gold bg-gold/10 px-2 py-0.5 rounded text-[9px]">{updateForm.serviceIds.length} Selected</span>}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {availableServices.map((svc) => {
                        const isSel = updateForm.serviceIds.includes(svc.id);
                        return (
                          <div
                            key={svc.id}
                            onClick={() => handleUpdateChange({ target: { name: "serviceIds", value: svc.id } })}
                            className={`cursor-pointer px-3 py-2 text-xs font-medium rounded-lg border transition-all truncate text-center ${isSel ? "border-gold bg-gold/5 text-black-deep" : "bg-white border-slate-200 text-slate-600 hover:border-gold/40"}`}
                            title={svc.name}
                          >
                            {svc.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button type="button" className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-black-deep bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50" disabled={updating}>
                  {updating ? "Updating…" : "Update Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Staff Profile View */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsProfileOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button className="absolute top-5 right-5 text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors z-10" onClick={() => setIsProfileOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            {profileData && (
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 bg-gold/10 text-gold">
                      {profileData.userProfileImageUrl ? <img src={profileData.userProfileImageUrl} alt={profileData.userFullName} className="w-full h-full object-cover" /> : getInitials(profileData.userFullName)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black-deep leading-tight m-0">{profileData.userFullName}</h2>
                      <div className="text-secondary font-medium mt-1">{profileData.designation}</div>
                      <div className="mt-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${profileData.isAvailable ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${profileData.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                          {profileData.isAvailable ? "Available" : "Off Duty"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {profileData.bio && (
                  <div className="px-8 py-5 border-b border-slate-100 bg-white">
                    <p className="text-secondary text-sm leading-relaxed italic m-0">"{profileData.bio}"</p>
                  </div>
                )}

                <div className="grid grid-cols-3 border-b border-slate-100 bg-white">
                  <div className="text-center py-5 border-r border-slate-100">
                    <div className="text-2xl font-bold text-black-deep mb-1">{(profileData.averageRating ?? 0).toFixed(1)}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center justify-center gap-1"><span className="text-gold">★</span> Rating</div>
                  </div>
                  <div className="text-center py-5 border-r border-slate-100">
                    <div className="text-2xl font-bold text-black-deep mb-1">{profileData.totalBookings ?? 0}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Bookings</div>
                  </div>
                  <div className="text-center py-5">
                    <div className="text-2xl font-bold text-black-deep mb-1">{profileData.totalReviews ?? 0}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Reviews</div>
                  </div>
                </div>

                <div className="px-8 py-6 border-b border-slate-100">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Contact & Schedule</h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <div className="text-[10px] font-bold text-secondary tracking-widest mb-1">EMAIL</div>
                      <div className="text-sm font-semibold text-black-deep">{profileData.userEmail || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary tracking-widest mb-1">PHONE</div>
                      <div className="text-sm font-semibold text-black-deep">{profileData.userPhoneNumber || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary tracking-widest mb-1">WORK HOURS</div>
                      <div className="text-sm font-semibold text-black-deep">
                        {profileData.workStartTime ? profileData.workStartTime.slice(0, 5) : '—'} - {profileData.workEndTime ? profileData.workEndTime.slice(0, 5) : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-secondary tracking-widest mb-1">COMMISSION</div>
                      <div className="text-sm font-semibold text-black-deep text-gold">{profileData.commission ?? 0}%</div>
                    </div>
                  </div>
                </div>

                {profileData.weeklyOffDays && profileData.weeklyOffDays.length > 0 && (
                  <div className="px-8 py-6 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Weekly Off Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_FULL.map(day => {
                        const isOff = profileData.weeklyOffDays.includes(day);
                        return isOff ? (
                          <span key={day} className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg border border-red-100">
                            {day.slice(0, 3)}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {profileData.specializedServices && profileData.specializedServices.length > 0 && (
                  <div className="px-8 py-6 border-b border-slate-100 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest m-0">Specialized Services</h4>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{profileData.specializedServices.length} Total</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specializedServices.map(svc => (
                        <div key={svc.id || svc} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 order border-slate-200 rounded-lg text-xs font-semibold text-black-deep">
                          {svc.name || svc}
                          <button className="text-slate-400 hover:text-red-500 transition-colors p-0.5" onClick={() => handleRemoveService(profileData.id, svc.id || svc, svc.name || svc)} title="Remove Service">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-8 py-6 border-t border-slate-100 bg-[#FDFBF7]">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-gold text-black-deep font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-gold/5 transition-colors" onClick={() => openAssignModal(profileData)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    Assign New Services
                  </button>
                </div>

              </div>
            )}
            {profileLoading && (
              <div className="flex-1 flex flex-col items-center justify-center p-20 bg-white">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4"></div>
                <div className="text-secondary text-sm font-medium">Loading full profile details...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal - Delete Staff Confirmation */}
      {isDeleteStaffOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsDeleteStaffOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm text-center p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black-deep mb-2">Delete Staff Member</h3>
            <p className="text-sm text-secondary mb-8 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-black-deep">{deletingStaffName}</span> from your team? This action cannot be undone and will affect their assigned services.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider text-xs border border-slate-200" onClick={() => setIsDeleteStaffOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors uppercase tracking-wider text-xs shadow-lg shadow-red-600/20 disabled:opacity-50" disabled={deletingStaff} onClick={handleDeleteStaff}>
                {deletingStaff ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Assign Services */}
      {isAssignOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsAssignOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
              <div>
                <h3 className="font-display text-2xl italic text-black-deep m-0">Assign Services</h3>
                <p className="text-sm text-secondary mt-1">Select services for {assignStaffName}</p>
              </div>
              <button className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors" onClick={() => setIsAssignOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {availableServices.length > 0 ? (
                <div className="space-y-2 mb-6">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Select Services</p>
                  <div className="grid grid-cols-1 gap-2">
                    {availableServices.map(svc => {
                      const isSel = assignSelectedIds.includes(svc.id);
                      return (
                        <div
                          key={svc.id}
                          onClick={() => toggleAssignService(svc.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSel ? 'border-gold bg-gold/5 translate-x-1' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <span className={`text-sm font-medium ${isSel ? 'text-black-deep' : 'text-slate-600'}`}>{svc.name}</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSel ? 'bg-gold border-gold text-black-deep' : 'border-slate-300'}`}>
                            {isSel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-secondary">
                  <p className="text-sm">No services available. Please create services first.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button type="button" className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider" onClick={() => setIsAssignOpen(false)}>Cancel</button>
              <button type="button" className="px-5 py-2.5 text-sm font-bold text-black-deep bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50" disabled={assigning} onClick={handleAssignServices}>
                {assigning ? "Assigning…" : "Update Services"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Slot Management */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 transition-opacity" onClick={(e) => e.target === e.currentTarget && setIsSlotModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
              <div>
                <h3 className="font-display text-2xl italic text-black-deep m-0">Slot Management</h3>
                <p className="text-sm text-secondary mt-1">{slotStaffName}</p>
              </div>
              <button className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors" onClick={() => setIsSlotModalOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {slotLoading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                  <span className="text-secondary text-sm font-medium">Checking available slots...</span>
                </div>
              ) : showGenerateUI ? (
                <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Generate Slots For</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSlotForm({ ...slotForm, duration: m })}
                          className={`px-4 py-3 text-sm font-bold border rounded-xl transition-all ${slotForm.duration === m ? "bg-gold border-gold text-black-deep" : "bg-white border-slate-200 text-slate-500 hover:border-gold/40"}`}
                        >
                          {m} {m === 1 ? 'Month' : 'Months'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <div className="flex gap-3 text-blue-700">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <p className="text-xs leading-relaxed">
                        This will automatically create appointment slots based on the staff's working hours and services for the next <b>{slotForm.duration} month{slotForm.duration > 1 ? 's' : ''}</b>.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Available Slots (Next 7 Days)</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">{fetchedSlots.length} Slots Found</span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(
                      fetchedSlots.reduce((acc, slot) => {
                        const date = slot.date;
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(slot);
                        return acc;
                      }, {})
                    ).map(([date, slots]) => (
                      <div key={date} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="font-bold text-black-deep text-xs mb-3 flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.slice(0, 8).map((slot) => (
                            <div key={slot.id} className={`px-2 py-1 rounded text-[10px] font-bold border ${slot.status === 'AVAILABLE' ? 'bg-white border-green-100 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                              {slot.startTime.substring(0, 5)}
                            </div>
                          ))}
                          {slots.length > 8 && (
                            <div className="px-2 py-1 rounded text-[10px] font-bold bg-white border border-slate-100 text-slate-400">
                              +{slots.length - 8} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowGenerateUI(true)}
                    className="w-full py-4 border-2 border-dashed border-gold/30 rounded-2xl text-gold font-bold text-sm hover:bg-gold/5 hover:border-gold/50 transition-all flex flex-col items-center justify-center gap-2 mt-4"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Generate More Slots</span>
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
                onClick={() => {
                  if (showGenerateUI && fetchedSlots.length > 0) {
                    setShowGenerateUI(false);
                  } else {
                    setIsSlotModalOpen(false);
                  }
                }}
              >
                {showGenerateUI && fetchedSlots.length > 0 ? "Back" : "Close"}
              </button>
              {showGenerateUI && (
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-black-deep bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50"
                  disabled={generatingSlots}
                  onClick={handleGenerateSlots}
                >
                  {generatingSlots ? "Generating…" : "Generate Slots"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;