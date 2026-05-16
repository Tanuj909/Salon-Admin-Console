import { useState, useEffect } from "react";
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    displayOrder: 1,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      iconUrl: "",
      displayOrder: 1,
      isActive: true,
    });
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
      iconUrl: category.iconUrl || "",
      displayOrder: category.displayOrder || 1,
      isActive: category.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        setActionLoading(id);
        await deleteCategoryApi(id);
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("Failed to delete category. Ensure no services are tied to it.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesApi();
      setCategories(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      // setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = {
        ...form,
        displayOrder: parseInt(form.displayOrder)
      };
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, data);
      } else {
        await createCategoryApi(data);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category", err);
      alert("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
      <div className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6 px-4 md:px-2">
          <div className="space-y-1">
            <h1 className="font-display text-4xl sm:text-5xl italic text-black-deep tracking-tight">Categories</h1>
            <p className="text-secondary text-sm sm:text-base font-medium opacity-80 transition-opacity hover:opacity-100 cursor-default">Manage service categories shown on the platform.</p>
          </div>
          <button
            className="group bg-gold text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:bg-black-deep hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 flex items-center justify-center gap-3 border-0 cursor-pointer w-full sm:w-auto"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-gold transition-colors duration-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-2">
          {loading ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
              <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Fetching categories</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white/50 backdrop-blur-sm rounded-[32px] border border-slate-100 shadow-sm mx-2">
              <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto mb-6 border border-slate-100 shadow-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm0 12h16v2H4z" /></svg>
              </div>
              <p className="text-xl font-bold text-black-deep mb-2">No categories found</p>
              <p className="text-sm text-secondary max-w-xs mx-auto">Create your first service category to help customers find what they need.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category?.id} className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-gold/5 hover:border-gold/20 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-gold group-hover:scale-110 group-hover:bg-gold/5 group-hover:border-gold/10 transition-all duration-500">
                    {category?.iconUrl ? (
                      <img src={category.iconUrl} alt={category.name} className="w-7 h-7 object-contain" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.72 0 3.33.48 4.7 1.32" /></svg>
                    )}
                  </div>
                  
                  {!category?.isActive && (
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-200">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-black-deep text-lg mb-2 leading-tight group-hover:text-gold transition-colors">{category?.name}</h3>
                  <p className="text-sm text-secondary line-clamp-2 leading-relaxed">
                    {category?.description || "No description provided for this specific category."}
                  </p>
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-50">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" /></svg>
                    Order: {category?.displayOrder}
                  </div>
                  
                  {/* Action Buttons - Fixed for Mobile */}
                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-2 md:group-hover:translate-y-0">
                    <button 
                      onClick={() => handleEdit(category)}
                      disabled={actionLoading === category.id}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-gold hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all disabled:opacity-50"
                      title="Edit Category"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={actionLoading === category.id}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-50"
                      title="Delete Category"
                    >
                      {actionLoading === category.id ? (
                        <div className="w-4 h-4 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Category Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
            {/* Modal Backdrop - clickable to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={resetForm}></div>
            
            <div className="relative bg-white rounded-[32px] sm:rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col mx-auto">
              <div className="bg-[#FDFBF7] px-6 py-6 sm:p-10 border-b border-gold/10 flex justify-between items-center flex-shrink-0">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl sm:text-4xl italic text-black-deep tracking-tight">{editingCategory ? "Edit Category" : "New Category"}</h2>
                  <p className="text-secondary tracking-wide text-[10px] sm:text-sm font-medium opacity-70 uppercase">{editingCategory ? "Update details" : "Add new business category"}</p>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-white text-slate-400 hover:text-black-deep hover:bg-slate-50 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all border border-slate-100 shadow-sm flex items-center justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              <div className="overflow-y-auto flex-grow custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-6 sm:p-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2.5 ml-1">Category Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. HAIR STYLING"
                        className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2.5 ml-1">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe this category..."
                        className="w-full h-28 bg-slate-50/50 border border-slate-200 text-black-deep py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2.5 ml-1">Icon URL</label>
                        <input
                          type="url"
                          name="iconUrl"
                          value={form.iconUrl}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2.5 ml-1">Display Order</label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={form.displayOrder}
                          onChange={handleChange}
                          className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-4 px-5 rounded-2xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 cursor-pointer group/toggle hover:bg-slate-50 transition-colors" onClick={(e) => {
                      if (e.target.tagName !== 'INPUT') {
                        setForm(prev => ({ ...prev, isActive: !prev.isActive }))
                      }
                    }}>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isActive ? 'bg-gold border-gold' : 'bg-white border-slate-200'}`}>
                        {form.isActive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={form.isActive}
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-black-deep group-hover/toggle:text-gold transition-colors">Category is Active</div>
                        <div className="text-[11px] text-secondary mt-0.5 font-medium opacity-70">Toggle visibility on the platform</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 pb-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all bg-white uppercase tracking-[0.15em] text-[10px] sm:text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-8 py-4 rounded-2xl bg-gold text-white font-bold hover:bg-black-deep hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50 border-0 uppercase tracking-[0.15em] text-[10px] sm:text-xs"
                    >
                      {submitting ? "Processing..." : (editingCategory ? "Update Changes" : "Create Category")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
