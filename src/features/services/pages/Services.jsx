import { useState, useEffect } from "react";
import { getServicesByBusinessApi, createServiceApi, updateServiceApi, deleteServiceApi } from "@/features/services/services/serviceService";
import { useBusiness } from "@/context/BusinessContext";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Star, 
  Clock, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  DollarSign,
  Briefcase,
  AlertCircle
} from "lucide-react";

const Services = () => {
  const { businessId } = useBusiness();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Create service form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    durationMinutes: 30,
    category: "Salon",
    imageUrl: "",
    isActive: true,
    isPopular: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Update service state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: 0,
    discountedPrice: 0,
    durationMinutes: 30,
    category: "Salon",
    imageUrl: "",
    isPopular: false
  });
  const [updating, setUpdating] = useState(false);

  // Delete service state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [deletingServiceName, setDeletingServiceName] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Mobile Details Modal State
  const [mobileServiceDetails, setMobileServiceDetails] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [popularOnly, setPopularOnly] = useState(false);


  useEffect(() => {
    if (businessId) fetchMyBusinessAndServices();
  }, [currentPage, businessId]);

  const fetchMyBusinessAndServices = async () => {
    try {
      setLoading(true);
      const data = await getServicesByBusinessApi(businessId, currentPage, 10);
      setServices(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createServiceApi(form);
      setIsModalOpen(false);
      setForm({
        name: "",
        description: "",
        price: 0,
        discountedPrice: 0,
        durationMinutes: 30,
        category: "Salon",
        imageUrl: "",
        isActive: true,
        isPopular: false
      });
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error creating service", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openUpdateModal = (service) => {
    setEditingService(service);
    setUpdateForm({
      name: service.name || "",
      price: service.price || 0,
      discountedPrice: service.discountedPrice || 0,
      durationMinutes: service.durationMinutes || 30,
      category: service.category || "Salon",
      imageUrl: service.imageUrl || "",
      isPopular: service.isPopular || false
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      setUpdating(true);
      await updateServiceApi(editingService.id, updateForm);
      setIsUpdateModalOpen(false);
      setEditingService(null);
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error updating service", err);
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (service) => {
    setDeletingServiceId(service.id);
    setDeletingServiceName(service.name);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteService = async () => {
    if (!deletingServiceId) return;
    try {
      setDeleting(true);
      await deleteServiceApi(deletingServiceId);
      setIsDeleteModalOpen(false);
      setDeletingServiceId(null);
      setDeletingServiceName("");
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error deleting service", err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    const matchesStatus = !statusFilter || (statusFilter === "active" ? service.isActive : !service.isActive);
    const matchesPopular = !popularOnly || service.isPopular;
    return matchesSearch && matchesCategory && matchesStatus && matchesPopular;
  });

  return (
    <div className="p-4 lg:p-8 bg-[#FDFBF7] min-h-screen font-jost">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="font-display text-5xl italic text-black-deep mb-2">Services</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gold hover:bg-black-deep text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl shadow-gold/20 transition-all active:scale-95 duration-300"
          >
            <Plus size={18} />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gold/10 overflow-hidden mb-8">
          <div className="px-6 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#FDFBF7]/50 gap-4">
             <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
                <div className="flex w-full lg:w-auto gap-3 items-center">
                    <div className="relative flex-1 lg:w-80">
                       <input 
                         type="text" 
                         placeholder="Search services..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 font-medium shadow-sm transition-all"
                       />
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                    <button 
                       onClick={() => setShowMobileFilters(!showMobileFilters)}
                       className={`lg:hidden p-3 border rounded-2xl transition-all flex items-center justify-center ${showMobileFilters ? 'bg-gold border-gold text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-gold hover:border-gold'}`}
                    >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                       </svg>
                    </button>
                </div>
                
                <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full lg:w-auto mt-2 lg:mt-0`}>
                    <select 
                       value={categoryFilter}
                       onChange={(e) => setCategoryFilter(e.target.value)}
                       className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer shadow-sm min-w-[160px]"
                    >
                       <option value="">All Categories</option>
                       {[...new Set(services.map(s => s.category))].map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                       ))}
                    </select>

                    <select 
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                       className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-gold/20 cursor-pointer shadow-sm min-w-[160px]"
                    >
                       <option value="">All Statuses</option>
                       <option value="active">Active</option>
                       <option value="inactive">Inactive</option>
                    </select>

                    <button 
                       onClick={() => setPopularOnly(!popularOnly)}
                       className={`w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                         popularOnly 
                           ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' 
                           : 'bg-white border-slate-200 text-slate-500 hover:border-amber-500 hover:text-amber-500'
                       }`}
                     >
                        <Star size={14} className={popularOnly ? 'fill-white' : ''} />
                        Popular Only
                     </button>
                </div>
             </div>
          </div>
        </div>

        {/* Services Table (Desktop) */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gold/10 overflow-hidden hidden lg:block">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-gold/10">
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Service Details</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-center">Duration</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Pricing</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-center">Bookings</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-24 text-center">
                       <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                       <p className="text-sm text-secondary font-bold uppercase tracking-[0.2em]">Synchronizing Menu...</p>
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-24 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-100">
                          <AlertCircle size={32} />
                       </div>
                       <p className="text-sm text-secondary font-bold uppercase tracking-widest">No services found in this selection</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                         <div>
                            <h4 className="font-bold text-black-deep text-lg group-hover:text-gold transition-colors">{service.name}</h4>
                            <p className="text-xs text-secondary mt-1 max-w-xs line-clamp-1 italic font-medium opacity-60">
                               {service.description || "No description provided"}
                            </p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                            <Tag size={12} className="text-gold" /> {service.category}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-black-deep">{service.durationMinutes}</span>
                            <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">Minutes</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex flex-col items-end">
                            {service.discountedPrice < service.price && (
                               <span className="text-[10px] text-slate-400 line-through font-bold">AED {service.price.toFixed(0)}</span>
                            )}
                            <span className="text-lg font-display italic text-black-deep">AED {service.effectivePrice?.toFixed(0)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex flex-col items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                               service.isActive 
                                 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                 : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}>
                               <span className={`w-1 h-1 rounded-full ${service.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                               {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {service.isPopular && (
                               <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tighter flex items-center gap-1">
                                  <Star size={10} className="fill-amber-500 text-amber-500" /> Popular Choice
                               </span>
                            )}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="text-sm font-bold text-black-deep">{service.totalBookings || 0}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                               onClick={() => openUpdateModal(service)}
                               className="p-2.5 bg-slate-50 text-slate-400 hover:bg-gold/10 hover:text-gold rounded-xl transition-all duration-300"
                               title="Edit Service"
                            >
                               <Edit2 size={16} />
                            </button>
                            <button 
                               onClick={() => openDeleteModal(service)}
                               className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300"
                               title="Delete Service"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
           
           {/* Pagination */}
           {totalPages > 1 && (
             <div className="px-8 py-5 border-t border-gold/10 flex items-center justify-between bg-[#FDFBF7]/50">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest opacity-60">
                   Page {currentPage + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                     disabled={currentPage === 0}
                     className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-gold hover:border-gold disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   {[...Array(totalPages)].map((_, i) => (
                     <button 
                       key={i}
                       onClick={() => setCurrentPage(i)}
                       className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                         currentPage === i 
                           ? 'bg-black-deep text-white shadow-lg' 
                           : 'bg-white border border-slate-200 text-slate-600 hover:border-gold hover:text-gold'
                       }`}
                     >
                        {i + 1}
                     </button>
                   ))}
                   <button 
                     onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                     disabled={currentPage === totalPages - 1}
                     className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-gold hover:border-gold disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* Mobile View (Kept as requested, but refined styling) */}
        <div className="lg:hidden space-y-4">
           {loading ? (
             <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto"></div>
             </div>
           ) : filteredServices.length === 0 ? (
             <div className="py-20 text-center bg-white rounded-3xl border border-gold/10 p-10">
                <AlertCircle size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">No services available</p>
             </div>
           ) : (
             filteredServices.map((service) => (
               <div key={service.id} className="bg-white rounded-3xl p-5 border border-gold/10 shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                     <div>
                        <h4 className="font-bold text-black-deep text-base">{service.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] text-secondary font-bold uppercase tracking-tighter">{service.category}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span className="text-[10px] text-gold font-bold uppercase tracking-tighter italic">{service.durationMinutes} MIN</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setMobileServiceDetails(service)}
                    className="flex items-center gap-2 bg-black-deep text-gold px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                     <Eye size={14} /> View
                  </button>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Modals - Refined Styling */}
      
      {/* Create Modal */}
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
           <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleSubmit}>
                 <div className="bg-black-deep p-8 text-white relative">
                    <div className="relative z-10">
                       <h2 className="font-display text-3xl italic m-0">Add New Service</h2>
                       <p className="text-gold/80 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Expand your salon's luxury offerings</p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20"
                      type="button"
                    >
                       <X size={20} />
                    </button>
                 </div>

                 <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep placeholder:font-normal placeholder:opacity-40"
                            placeholder="e.g. Royal Gold Facial"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                          <textarea 
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all min-h-[100px] text-sm text-slate-600 font-medium"
                            placeholder="Describe the experience..."
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                          <input 
                            type="text" 
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Duration (Mins)</label>
                          <div className="relative">
                             <input 
                               type="number" 
                               name="durationMinutes"
                               value={form.durationMinutes}
                               onChange={handleChange}
                               className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep pr-12"
                             />
                             <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Standard Price (AED)</label>
                          <input 
                            type="number" 
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 block">Special Price (AED)</label>
                          <input 
                            type="number" 
                            name="discountedPrice"
                            value={form.discountedPrice}
                            onChange={handleChange}
                            className="w-full bg-gold/5 border border-gold/10 focus:border-gold focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-gold"
                          />
                       </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 rounded-lg accent-emerald-500 border-slate-300 transition-all cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-black-deep">Active Service</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="isPopular"
                            checked={form.isPopular}
                            onChange={handleChange}
                            className="w-5 h-5 rounded-lg accent-amber-500 border-slate-300 transition-all cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-black-deep">Mark as Popular</span>
                       </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button" 
                         onClick={() => setIsModalOpen(false)}
                         className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                       >
                          Discard
                       </button>
                       <button 
                         type="submit"
                         disabled={submitting}
                         className="flex-[2] py-4 bg-black-deep text-gold rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-gold hover:text-white shadow-xl transition-all disabled:opacity-50"
                       >
                          {submitting ? "Publishing..." : "Publish Service"}
                       </button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* Update Modal */}
      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4" onClick={() => setIsUpdateModalOpen(false)}>
           <div className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleUpdateSubmit}>
                 <div className="bg-black-deep p-8 text-white relative">
                    <div className="relative z-10">
                       <h2 className="font-display text-3xl italic m-0">Edit Service</h2>
                       <p className="text-gold/80 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Refine your luxury details</p>
                    </div>
                    <button 
                      onClick={() => setIsUpdateModalOpen(false)} 
                      className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20"
                      type="button"
                    >
                       <X size={20} />
                    </button>
                 </div>

                 <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={updateForm.name}
                            onChange={handleUpdateChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                          <input 
                            type="text" 
                            name="category"
                            value={updateForm.category}
                            onChange={handleUpdateChange}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Duration (Mins)</label>
                          <div className="relative">
                             <input 
                               type="number" 
                               name="durationMinutes"
                               value={updateForm.durationMinutes}
                               onChange={handleUpdateChange}
                               className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep pr-12"
                             />
                             <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Price (AED)</label>
                          <input 
                            type="number" 
                            name="price"
                            value={updateForm.price}
                            onChange={handleUpdateChange}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-gold/50 focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-black-deep"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 block">Special Price (AED)</label>
                          <input 
                            type="number" 
                            name="discountedPrice"
                            value={updateForm.discountedPrice}
                            onChange={handleUpdateChange}
                            className="w-full bg-gold/5 border border-gold/10 focus:border-gold focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold text-gold"
                          />
                       </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            name="isPopular"
                            checked={updateForm.isPopular}
                            onChange={handleUpdateChange}
                            className="w-5 h-5 rounded-lg accent-amber-500 border-slate-300 transition-all cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-black-deep">Mark as Popular</span>
                       </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button" 
                         onClick={() => setIsUpdateModalOpen(false)}
                         className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                         type="submit"
                         disabled={updating}
                         className="flex-[2] py-4 bg-black-deep text-gold rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-gold hover:text-white shadow-xl transition-all disabled:opacity-50"
                       >
                          {updating ? "Saving Changes..." : "Update Details"}
                       </button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200] flex items-center justify-center p-4" onClick={() => setIsDeleteModalOpen(false)}>
           <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} />
                 </div>
                 <h3 className="font-bold text-black-deep text-lg mb-2">Delete Service?</h3>
                 <p className="text-sm text-secondary font-medium leading-relaxed px-4">
                    Are you sure you want to remove <span className="text-red-500 font-bold">"{deletingServiceName}"</span>? This action cannot be undone.
                 </p>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                 <button 
                   onClick={() => setIsDeleteModalOpen(false)}
                   className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleDeleteService}
                   disabled={deleting}
                   className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                 >
                    {deleting ? "Deleting..." : "Delete"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Mobile Detail Modal */}
      {mobileServiceDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1300] flex items-center justify-center p-4 lg:hidden" onClick={() => setMobileServiceDetails(null)}>
           <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
                 <h3 className="font-display text-2xl italic text-black-deep m-0">Service Detail</h3>
                 <button onClick={() => setMobileServiceDetails(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full">
                    <X size={18} />
                 </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-gold/5 flex items-center justify-center text-gold font-bold text-3xl border border-gold/10 shadow-inner">
                       {mobileServiceDetails.name?.charAt(0)}
                    </div>
                    <div>
                       <h4 className="font-bold text-black-deep text-xl leading-tight">{mobileServiceDetails.name}</h4>
                       <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">{mobileServiceDetails.category}</p>
                    </div>
                 </div>

                 <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 italic">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                       {mobileServiceDetails.description || "No description available for this service."}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-gold/10">
                       <p className="text-[9px] font-bold text-secondary/50 uppercase tracking-widest mb-1">Duration</p>
                       <p className="font-bold text-black-deep text-base">{mobileServiceDetails.durationMinutes} Mins</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-bold text-secondary/50 uppercase tracking-widest mb-1">Bookings</p>
                       <p className="font-bold text-black-deep text-base">{mobileServiceDetails.totalBookings || 0}</p>
                    </div>
                 </div>

                 <div className="bg-black-deep p-6 rounded-[24px] shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 flex justify-between items-center">
                       <div>
                          <p className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Premium Pricing</p>
                          <h3 className="text-3xl font-display italic text-white">AED {mobileServiceDetails.effectivePrice?.toFixed(0)}</h3>
                       </div>
                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          mobileServiceDetails.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                       }`}>
                          {mobileServiceDetails.isActive ? 'Active' : 'Inactive'}
                       </div>
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
                 </div>
              </div>
              
              <div className="p-8 pt-0 flex gap-4">
                 <button 
                   onClick={() => { setMobileServiceDetails(null); openUpdateModal(mobileServiceDetails); }}
                   className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                 >
                    Edit
                 </button>
                 <button 
                   onClick={() => { setMobileServiceDetails(null); openDeleteModal(mobileServiceDetails); }}
                   className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                 >
                    Remove
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Services;
