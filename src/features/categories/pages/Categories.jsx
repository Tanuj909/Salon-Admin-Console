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
      // Ensure data is an array before setting state
      setCategories(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]); // Reset to empty array on error
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Service Categories</h1>
          <p className="text-slate-500 mt-1">Manage global categories for salon services</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <span>➕</span> Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
            No categories created yet.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category?.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                  {category?.iconUrl ? (
                      <img src={category.iconUrl} alt={category.name} className="w-8 h-8 object-contain" />
                  ) : "📁"}
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category?.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {category?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{category?.name}</h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed h-10">{category?.description}</p>
              <div className="mt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Display Order: {category?.displayOrder}</span>
                <button className="text-indigo-600 hover:underline">Edit Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white">
              <h2 className="text-xl font-bold">New Category</h2>
              <p className="text-indigo-100 text-sm opacity-80">Define a new business category</p>
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
                  placeholder="e.g. WOMEN"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this category..."
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
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
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
                  className="w-4 h-4 text-indigo-600"
                />
                <label htmlFor="isActive" className="text-sm text-slate-600 font-medium">Category is Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
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
