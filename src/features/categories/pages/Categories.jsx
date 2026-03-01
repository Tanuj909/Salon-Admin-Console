import { useState, useEffect } from "react";
import { getCategoriesApi, createCategoryApi } from "../services/categoryService";

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
      await createCategoryApi({
        ...form,
        displayOrder: parseInt(form.displayOrder)
      });
      setIsModalOpen(false);
      setForm({
        name: "",
        description: "",
        iconUrl: "",
        displayOrder: 1,
        isActive: true,
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to create category", err);
      alert("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
      <div className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-2">Categories</h1>
            <p className="text-secondary text-base">Manage service categories shown on the platform.</p>
          </div>
          <button
            className="bg-gold text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
          {loading ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 10h16v2H4zm0 4h16v2H4zm0-8h16v2H4zm0 12h16v2H4z" /></svg>
              </div>
              <p className="text-lg font-bold text-black-deep mb-1">No categories created yet</p>
              <p className="text-sm text-secondary">Start by defining service categories for salons.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category?.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-gold/30 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="w-12 h-12 bg-[#FDFBF7] rounded-xl flex items-center justify-center mb-4 border border-gold/10 text-gold group-hover:scale-110 transition-transform">
                  {category?.iconUrl ? (
                    <img src={category.iconUrl} alt={category.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.72 0 3.33.48 4.7 1.32" /></svg>
                  )}
                </div>

                <h3 className="font-bold text-black-deep text-lg mb-1 leading-tight">{category?.name}</h3>
                <p className="text-sm text-secondary mb-6 line-clamp-2">
                  {category?.description || "No description provided for this specific category."}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    Order: {category?.displayOrder}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-gold hover:bg-gold/10 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                    </button>
                  </div>
                </div>

                {(!category?.isActive) && (
                  <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-slate-200">
                    Inactive
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Category Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#FDFBF7] p-8 border-b border-gold/10 flex justify-between items-start">
                <div>
                  <h2 className="font-display text-3xl italic text-black-deep">New Category</h2>
                  <p className="text-secondary tracking-wide text-sm mt-1">Define a new business category</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. HAIR STYLING"
                      className="w-full bg-white border border-slate-200 text-black-deep py-3 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe this category..."
                      className="w-full h-24 bg-white border border-slate-200 text-black-deep py-3 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Icon URL</label>
                      <input
                        type="url"
                        name="iconUrl"
                        value={form.iconUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full bg-white border border-slate-200 text-black-deep py-3 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Display Order</label>
                      <input
                        type="number"
                        name="displayOrder"
                        value={form.displayOrder}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 text-black-deep py-3 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={(e) => {
                    if (e.target.tagName !== 'INPUT') {
                      setForm(prev => ({ ...prev, isActive: !prev.isActive }))
                    }
                  }}>
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-gold focus:ring-gold pointer-events-auto"
                    />
                    <div>
                      <div className="text-sm font-bold text-black-deep">Category is Active</div>
                      <div className="text-xs text-secondary mt-0.5">Toggle visibility on the platform</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors bg-white uppercase tracking-wider text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 rounded-xl bg-gold text-white font-bold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 border-0 uppercase tracking-wider text-xs"
                  >
                    {submitting ? "Saving..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
