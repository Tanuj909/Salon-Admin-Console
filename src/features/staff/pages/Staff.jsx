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
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-slate-500 font-medium">Coordinate your team of professional service providers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
        >
          <span>👤</span> Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && staffList.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold italic animate-pulse">
            LOADING YOUR TEAM...
          </div>
        ) : staffList.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">🤝</span>
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No staff members listed</p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-indigo-600 font-bold hover:underline"
            >
                Register your first staff member
            </button>
          </div>
        ) : (
          staffList.map((staff) => (
            <div key={staff.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 group overflow-hidden hover:shadow-xl transition-all duration-500 p-8">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-3xl font-black border border-indigo-100 relative shadow-inner overflow-hidden">
                        {staff.userProfileImageUrl ? (
                            <img src={staff.userProfileImageUrl} alt={staff.userFullName} className="w-full h-full object-cover" />
                        ) : staff.userFullName?.charAt(0)}
                        <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            staff.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}></span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {staff.userFullName}
                        </h3>
                        <p className="text-indigo-500 text-xs font-black uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded-md inline-block">
                            {staff.designation}
                        </p>
                    </div>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 italic h-10">
                    "{staff.bio}"
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <p className="text-lg font-black text-slate-900">{staff.averageRating.toFixed(1)}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Avg Rating</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <p className="text-lg font-black text-slate-900">{staff.serviceCount}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Services</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Status</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                            staff.isAvailable ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                            {staff.isAvailable ? 'Ready' : 'Off-Duty'}
                        </span>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:scale-105 transition-transform">
                        Manage Schedule →
                    </button>
                </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Create Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-indigo-600 p-8 text-white relative flex-shrink-0">
                <h2 className="text-3xl font-black leading-none mb-1 uppercase">NEW TEAM MEMBER</h2>
                <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest opacity-80">Sync your staff with beauty services</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Link User ID</label>
                        <input
                            type="number"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                            placeholder="e.g. 4"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Professional Designation</label>
                        <input
                            type="text"
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                            placeholder="e.g. Senior Hair Stylist"
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Biography</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-medium text-slate-900 h-20"
                            placeholder="A brief professionally intro for clients..."
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Working Hours</label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                name="workStartTime"
                                value={form.workStartTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900 text-center"
                            />
                            <span className="flex items-center text-slate-300 font-bold">To</span>
                            <input
                                type="time"
                                name="workEndTime"
                                value={form.workEndTime}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900 text-center"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Commission (%)</label>
                        <input
                            type="number"
                            name="commission"
                            step="0.1"
                            value={form.commission}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block underline decoration-indigo-200">Weekly Off Days</label>
                    <div className="flex flex-wrap gap-2">
                        {days.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleChange({ target: { name: "weeklyOffDays", value: day } })}
                                className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${
                                    form.weeklyOffDays.includes(day)
                                        ? 'bg-rose-50 text-rose-600 border-rose-200 ring-2 ring-rose-50 ring-offset-0 scale-105'
                                        : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block underline decoration-indigo-200">Assign Expertise (Services)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableServices.map(service => (
                            <div 
                                key={service.id}
                                onClick={() => handleChange({ target: { name: "serviceIds", value: service.id } })}
                                className={`p-4 rounded-[1.5rem] border cursor-pointer transition-all ${
                                    form.serviceIds.includes(service.id)
                                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-100 scale-[1.02]'
                                        : 'bg-slate-50 text-slate-600 border-transparent hover:border-indigo-100'
                                }`}
                            >
                                <p className="text-xs font-black truncate">{service.name}</p>
                                <p className={`text-[10px] ${form.serviceIds.includes(service.id) ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {service.durationMinutes} Min | ₹{service.effectivePrice}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-10">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all font-sans"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 font-sans disabled:opacity-50"
                    >
                        {submitting ? "Signing Contract..." : "Register Provider"}
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
