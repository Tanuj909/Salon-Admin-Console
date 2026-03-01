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
      setCategories([]);
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
    <div className="page active">
      <div className="admin-page-header p-10 flex items-start justify-between border-b border-gold/10">
        <div>
          <h1 className="font-display text-4xl italic text-black-deep">Categories</h1>
          <p className="text-secondary text-sm mt-2 font-medium">Manage service categories shown on the platform.</p>
        </div>
        <button className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all flex items-center gap-2 border-0 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
            No categories created yet.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category?.id} className="category-card">
              <div className="cat-icon text-xl">
                {category?.iconUrl ? (
                  <img src={category.iconUrl} alt={category.name} className="w-6 h-6 object-contain" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.72 0 3.33.48 4.7 1.32" /></svg>
                )}
              </div>
              <div className="cat-name uppercase">{category?.name}</div>
              <div className="cat-count">Order: {category?.displayOrder}</div>
              <div className="cat-actions mt-auto">
                <button className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
                <button className="admin-btn admin-btn-red admin-btn-sm">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep/40 backdrop-blur-md z-[1001] flex items-center justify-center p-4">
          <div className="bg-cream rounded-[40px] w-full max-w-md shadow-luxe overflow-hidden border border-gold/20 animate-slide-up">
            <div className="bg-gold p-10 text-black-deep">
              <h2 className="font-display text-3xl italic">New Category</h2>
              <p className="text-black-deep/60 text-[10px] uppercase font-bold tracking-widest mt-1">Define a new business category</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HAIR STYLING"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this category..."
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Icon URL</label>
                  <input
                    type="url"
                    name="iconUrl"
                    value={form.iconUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4a7cf7]"
                />
                <label htmlFor="isActive" className="text-sm text-slate-600 font-medium">Category is Active</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-gold/20 text-secondary py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-beige transition-all border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gold text-black-deep py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all disabled:opacity-50 border-0 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
