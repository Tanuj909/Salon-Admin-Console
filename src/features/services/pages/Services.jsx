import { useState, useEffect } from "react";
import { getServicesByBusinessApi, createServiceApi } from "../services/serviceService";
import { getMyBusinessApi } from "@/features/salons/services/salonService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMyBusinessAndServices();
  }, [currentPage]);

  const fetchMyBusinessAndServices = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
      }
      
      const data = await getServicesByBusinessApi(bId, currentPage, 10);
      setServices(data.content || []);
      setTotalPages(data.totalPages || 0);
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
      alert("Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Salon Services</h1>
          <p className="text-slate-500 font-medium">Create and manage your menu of expert beauty treatments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
        >
          <span>✨</span> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && services.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold italic animate-pulse">
            LOADING YOUR SERVICE MENU...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">📭</span>
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No services added yet</p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-indigo-600 font-bold hover:underline"
            >
                Start by adding your first service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 group overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="h-48 bg-slate-50 relative">
                    {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 text-4xl font-black">
                            {service.name.charAt(0)}
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {service.isPopular && (
                            <span className="bg-amber-400 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                                🔥 Popular
                            </span>
                        )}
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm ${
                            service.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                        }`}>
                            {service.isActive ? 'Active' : 'Private'}
                        </span>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                            {service.category}
                        </span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                            ⏱️ {service.durationMinutes} Min
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase leading-none">
                        {service.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
                        {service.description}
                    </p>
                    
                    <div className="flex items-end justify-between pt-6 border-t border-slate-50">
                        <div>
                            {service.discountedPrice < service.price && (
                                <p className="text-slate-400 line-through text-xs font-bold mb-0.5">₹{service.price}</p>
                            )}
                            <p className="text-3xl font-black text-slate-900 leading-none">₹{service.effectivePrice}</p>
                        </div>
                        <button className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 bg-white px-8 py-4 rounded-2xl w-fit mx-auto border border-slate-100 shadow-sm">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 disabled:opacity-30 hover:bg-slate-50 rounded-lg transition-colors"
          >
            ⬅️ Prev
          </button>
          <span className="font-black text-slate-900 text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 disabled:opacity-30 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Modal - Create Service */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 p-10 text-white relative">
                <div className="absolute top-10 right-10 text-indigo-400 text-6xl opacity-20 font-black select-none uppercase tracking-tighter">NEW</div>
                <h2 className="text-3xl font-black leading-none mb-2">ADD SERVICE</h2>
                <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest opacity-80">Expand your business menu</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Title</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                            placeholder="e.g. Hair Cut & Styling"
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-medium text-slate-900 h-24"
                            placeholder="Detail what makes this service special..."
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Duration (Minutes)</label>
                        <input
                            type="number"
                            name="durationMinutes"
                            value={form.durationMinutes}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Standard Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Offer Price (₹)</label>
                        <input
                            type="number"
                            name="discountedPrice"
                            value={form.discountedPrice}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-bold text-slate-900 text-indigo-600"
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cover Image URL</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-transparent border focus:border-indigo-200 outline-none p-4 rounded-2xl transition-all font-medium text-slate-900"
                            placeholder="https://..."
                        />
                    </div>
                </div>
                
                <div className="flex gap-10 py-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 accent-indigo-600"
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Visible to Public</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="isPopular"
                            checked={form.isPopular}
                            onChange={handleChange}
                            className="w-5 h-5 accent-amber-500"
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Trending Label</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Create Service"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
