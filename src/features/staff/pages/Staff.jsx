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
  
  // Create staff form state
  const [form, setForm] = useState({
    designation: "",
    bio: "",
    commission: 10.0,
    isAvailable: true,
    workStartTime: "09:00:00",
    workEndTime: "18:00:00",
    weeklyOffDays: ["SUNDAY"],
    role: "STAFF",
    userId: "",
    serviceIds: []
  });
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchStaffAndBusiness();
  }, [currentPage]);

  const fetchStaffAndBusiness = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
        
        // Fetch services for the creation modal
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
        setForm(prev => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(id) 
                ? prev.serviceIds.filter(sId => sId !== id)
                : [...prev.serviceIds, id]
        }));
    } else if (name === "weeklyOffDays") {
        setForm(prev => ({
            ...prev,
            weeklyOffDays: prev.weeklyOffDays.includes(value)
                ? prev.weeklyOffDays.filter(day => day !== value)
                : [...prev.weeklyOffDays, value]
        }));
    } else {
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createStaffApi({
          ...form,
          userId: parseInt(form.userId)
      });
      setIsModalOpen(false);
      setForm({
        designation: "",
        bio: "",
        commission: 10.0,
        isAvailable: true,
        workStartTime: "09:00:00",
        workEndTime: "18:00:00",
        weeklyOffDays: ["SUNDAY"],
        role: "STAFF",
        userId: "",
        serviceIds: []
      });
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error creating staff", err);
      alert("Failed to create staff member");
    } finally {
      setSubmitting(false);
    }
  };

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  return (
    <div className="page active">
      <div className="admin-page-header" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <div>
          <h1>Staff Management</h1>
          <p>Coordinate your team of professional service providers.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="admin-btn admin-btn-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && staffList.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 animate-pulse">
            LOADING YOUR TEAM...
          </div>
        ) : staffList.length === 0 ? (
          <div className="col-span-full admin-card p-12 text-center border-dashed border-2">
            <span className="text-4xl mb-4 block">🤝</span>
            <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No staff members listed</p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-[#4a7cf7] font-bold hover:underline"
            >
                Register your first staff member
            </button>
          </div>
        ) : (
          staffList.map((staff) => (
            <div key={staff.id} className="admin-card p-6 group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="avatar" style={{width: '64px', height: '64px', borderRadius: '16px', fontSize: '24px'}}>
                        {staff.userProfileImageUrl ? (
                            <img src={staff.userProfileImageUrl} alt={staff.userFullName} className="w-full h-full object-cover" />
                        ) : staff.userFullName?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-[#4a7cf7] transition-colors leading-tight">
                            {staff.userFullName}
                        </h3>
                        <p className="text-[#4a7cf7] text-[10px] font-bold uppercase tracking-widest mt-1">
                            {staff.designation}
                        </p>
                    </div>
                </div>
                
                <p className="text-slate-500 text-xs mb-6 leading-relaxed line-clamp-2 h-8 italic">
                    "{staff.bio}"
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                        <p className="text-lg font-bold text-slate-900">{staff.averageRating.toFixed(1)}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Avg Rating</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                        <p className="text-lg font-bold text-slate-900">{staff.serviceCount}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Services</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <span className={`status-badge ${staff.isAvailable ? 'verified' : ''}`} style={{fontSize: '9px'}}>
                            {staff.isAvailable ? 'Ready' : 'Off-Duty'}
                        </span>
                    </div>
                    <button className="text-xs font-bold text-[#4a7cf7] hover:underline">
                        Manage →
                    </button>
                </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Create Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#4a7cf7] p-8 text-white flex-shrink-0">
                <h2 className="text-2xl font-bold uppercase leading-tight">New Team Member</h2>
                <p className="text-white opacity-80 font-bold text-xs uppercase tracking-widest">Register a professional service provider</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Link User ID</label>
                        <input
                            type="number"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border-transparent border focus:border-[#4a7cf7] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                            placeholder="e.g. 4"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border-transparent border focus:border-[#4a7cf7] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                            placeholder="e.g. Senior Hair Stylist"
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Biography</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-[#4a7cf7] outline-none p-3 rounded-xl transition-all h-20 text-sm"
                            placeholder="Brief intro for clients..."
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Work Hours</label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                name="workStartTime"
                                value={form.workStartTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-xs font-bold"
                            />
                            <input
                                type="time"
                                name="workEndTime"
                                value={form.workEndTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-xs font-bold"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Commission (%)</label>
                        <input
                            type="number"
                            name="commission"
                            step="0.1"
                            value={form.commission}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-[#4a7cf7] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Weekly Off Days</label>
                    <div className="flex flex-wrap gap-2">
                        {days.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleChange({ target: { name: "weeklyOffDays", value: day } })}
                                className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                                    form.weeklyOffDays.includes(day)
                                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                                        : 'bg-white text-slate-400 border-slate-100'
                                }`}
                            >
                                {day.substring(0,3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Expertise (Services)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableServices.map(service => (
                            <div 
                                key={service.id}
                                onClick={() => handleChange({ target: { name: "serviceIds", value: service.id } })}
                                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                    form.serviceIds.includes(service.id)
                                        ? 'bg-[#4a7cf7] text-white border-[#4a7cf7]'
                                        : 'bg-slate-50 text-slate-600 border-transparent'
                                }`}
                            >
                                <p className="text-[10px] font-bold truncate">{service.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-[#4a7cf7] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#3d6ef0] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Register"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
