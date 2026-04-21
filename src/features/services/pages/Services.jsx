import { useState, useEffect } from "react";
import { getServicesByBusinessApi, createServiceApi, updateServiceApi, deleteServiceApi } from "@/features/services/services/serviceService";
import { useBusiness } from "@/context/BusinessContext";

const Services = () => {
  const { businessId } = useBusiness();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
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
      alert("Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  // Open update modal pre-filled with selected service data
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
      alert("Failed to update service");
    } finally {
      setUpdating(false);
    }
  };

  // Delete service
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
      alert("Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };


  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    const matchesStatus = !statusFilter || (statusFilter === "active" ? service.isActive : !service.isActive);
    const matchesPopular = !popularOnly || service.isPopular;
    return matchesSearch && matchesCategory && matchesStatus && matchesPopular;
  });


  return (
    <div className="page active w-full font-jost font-light">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@600;700&display=swap');

        .services-container {
          font-family: 'Jost', sans-serif;
          color: #1C1C1C;
          padding: 1rem 1rem 3rem 1rem;
          width: 100%;
          max-width: 1024px;
          margin: 0 auto;
          background: transparent;
        }

        .services-container *, .services-container *::before, .services-container *::after { 
            box-sizing: border-box; 
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .page-header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-style: italic;
          font-weight: 400;
          color: #1C1C1C;
          margin: 0;
        }

        .page-header-left p {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7065;
          margin-top: 0.5rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #C8A951;
          color: #1C1C1C;
          border: none;
          padding: 1rem 2rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: 'Jost', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .btn-primary:hover { 
          background: #B69843; 
          box-shadow: 0 10px 30px -10px rgba(200, 169, 81, 0.5);
          transform: translateY(-2px);
        }

        /* Removed stats bar styles */

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }

        .search-wrap svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input:focus { border-color: #C8A951; }
        .search-input::placeholder { color: #9CA3AF; }

        .filter-select {
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          background: #FFFFFF;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #C8A951; }

        .toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #6B7280;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          user-select: none;
        }
        .toggle-pill:hover { border-color: #1B3F6E; color: #1B3F6E; }
        .toggle-pill.on {
          background: #EFF4FB;
          border-color: #BFDBFE;
          color: #1B3F6E;
          font-weight: 500;
        }

        .table-container {
          background: #FDFAF6;
          border: 1px solid rgba(200, 169, 81, 0.1);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
        }

        thead th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #6B7280;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #F3F4F6;
          transition: background 0.12s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #F8FAFC; }

        tbody td {
          padding: 14px 16px;
          vertical-align: middle;
          font-size: 13.5px;
          color: #374151;
        }

        /* .svc-image {
          width: 58px; height: 58px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: block;
        }
        .img-placeholder {
          width: 58px; height: 58px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: flex; align-items: center; justify-content: center;
          color: #9CA3AF;
        } */

        .svc-name {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
          margin-bottom: 3px;
        }

        .svc-desc {
          font-size: 12px;
          color: #6B7280;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 500;
        }

        .badge-gray {
          background: #F3F4F6;
          color: #374151;
          border: 1px solid #E5E7EB;
        }

        .badge-green {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .badge-amber {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .badge-popular {
          background: #FEFCE8;
          color: #854D0E;
          border: 1px solid #FDE68A;
        }

        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-badges { display: flex; flex-direction: column; gap: 5px; }

        .price-original {
          font-size: 12px;
          color: #9CA3AF;
          text-decoration: line-through;
          display: block;
        }

        .price-main {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .price-label {
          font-size: 11px;
          color: #6B7280;
          margin-top: 2px;
        }

        .staff-zero {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #92400E;
        }

        .action-wrap { position: relative; }

        .btn-update {
          background: #EFF4FB;
          color: #1B3F6E;
          border: 1px solid #BFDBFE;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-update:hover { background: #DCE7F5; }

        .btn-delete {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          margin-left: 6px;
        }
        .btn-delete:hover { background: #FEE2E2; }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .delete-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .delete-modal {
          background: #FFFFFF;
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          text-align: center;
        }

        .delete-modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #FEF2F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .delete-modal-body {
          padding: 32px 32px 24px;
        }

        .delete-modal-body h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px;
        }

        .delete-modal-body p {
          font-size: 13.5px;
          color: #6B7280;
          margin: 0;
          line-height: 1.5;
        }

        .delete-modal-body .service-name-highlight {
          font-weight: 600;
          color: #DC2626;
        }

        .delete-modal-actions {
          display: flex;
          gap: 10px;
          padding: 0 32px 28px;
        }

        .delete-modal-actions button {
          flex: 1;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .btn-cancel-delete {
          background: #F3F4F6;
          color: #6B7280;
        }
        .btn-cancel-delete:hover { background: #E5E7EB; }

        .btn-confirm-delete {
          background: #DC2626;
          color: white;
        }
        .btn-confirm-delete:hover { background: #B91C1C; }
        .btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 0 0 10px 10px;
        }

        .pagination-info {
          font-size: 13px;
          color: #6B7280;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .page-btn.current {
          background: #1B3F6E;
          border-color: #1B3F6E;
          color: white;
          cursor: default;
          opacity: 1;
        }

        .empty-row td {
          text-align: center;
          padding: 48px 0;
          color: #6B7280;
          font-size: 13.5px;
        }

        @media (max-width: 768px) {
          table, thead, tbody, th, td, tr { display: block; width: 100%; }
          thead tr { position: absolute; top: -9999px; left: -9999px; }
          tbody tr { margin-bottom: 20px; border: 1px solid rgba(200, 169, 81, 0.1); border-radius: 24px; padding: 20px; background: #FFFFFF; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.02); }
          tbody td { padding: 10px 0; border: none; display: flex; justify-content: space-between; align-items: center; text-align: right; position: relative; border-bottom: 1px solid #f8f8f8; }
          tbody td:last-child { border-bottom: none; padding-top: 15px; }
          tbody td::before { content: attr(data-label); font-weight: 800; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #7a7065; flex-shrink: 0; text-align: left; }
          .action-buttons { width: 100%; justify-content: flex-start; margin-top: 8px; flex-wrap: wrap; }
          .svc-desc { max-width: 100%; white-space: normal; }
          /* tbody td[data-label="Image"] { flex-direction: row; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6; padding-bottom: 12px; margin-bottom: 8px; } */
          /* tbody td[data-label="Image"]::before { content: none; } */
          .table-container { background: transparent; border: none; box-shadow: none; border-radius: 0; }
          .page-header { flex-direction: column; gap: 16px; align-items: stretch; }
          .btn-primary { width: 100%; justify-content: center; }
          .filter-bar { flex-direction: column; align-items: stretch; }
          .search-wrap { max-width: none; }
          .filter-select { width: 100%; }
          .toggle-pill { width: 100%; justify-content: center; }
          
          /* Show Image, Name, and Actions on mobile */
          tbody td[data-label="Category"],
          tbody td[data-label="Duration"],
          tbody td[data-label="Pricing"],
          tbody td[data-label="Status"],
          tbody td[data-label="Bookings"],
          tbody td[data-label="Staff"] {
            display: none !important;
          }
          
          /* tbody td[data-label="Image"] {
            display: flex !important;
            padding: 0;
            border: none;
            width: 50px;
          } */
          
          tbody td[data-label="Service Name"] {
            display: flex !important;
            flex: 1;
            padding: 0 12px;
            border: none;
            justify-content: flex-start;
            text-align: left;
          }
          
          tbody td[data-label="Actions"] {
            display: flex !important;
            padding: 0;
            border: none;
            width: auto;
          }
          
          tbody tr {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 0;
            padding: 12px 16px;
            border-radius: 20px;
            margin-bottom: 12px;
            background: #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          }
          
          tbody td::before {
            display: none !important;
          }
          
          /* .svc-image {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            object-fit: cover;
          }
          
          .img-placeholder {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FDFBF7;
            color: #C8A951;
            border: 1px solid rgba(200, 169, 81, 0.1);
          } */
          
          .svc-name {
            font-size: 14px;
            font-weight: 700;
            color: #1C1C1C;
          }
          
          .svc-desc { display: none; }

          .btn-view-details {
            display: flex !important;
            background: #1C1C1C;
            color: #C8A951;
            padding: 8px 20px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: none;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-view-details:hover {
            background: #000000;
            transform: translateY(-1px);
          }
        }
        
        @media (min-width: 769px) {
          .btn-view-details {
            padding: 10px 24px;
            font-size: 11px;
          }
        }
        `}
      </style>

      <main className="services-container container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Services <span className="hidden md:inline">— Desert Pearl Beauty Lounge</span></h1>
            <p className="hidden md:block text-secondary text-sm">Review and manage the list of services for your business.</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Service
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search services…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(services.map(s => s.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div
            className={`toggle-pill ${popularOnly ? 'on' : ''}`}
            onClick={() => setPopularOnly(!popularOnly)}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Popular Only
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {/* <th style={{ width: '74px' }}>Image</th> */}
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Staff</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row">
                  <td colSpan="8">Loading services...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="8">No services match your filters.</td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id}>
                    {/* <td data-label="Image">
                      {service.imageUrl ? (
                        <img className="svc-image" src={service.imageUrl} alt={service.name} />
                      ) : (
                        <div className="img-placeholder">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                      )}
                    </td> */}
                    <td data-label="Service Name">
                      <div className="svc-name">{service.name}</div>
                      <div className="svc-desc">{service.description}</div>
                    </td>
                    <td data-label="Category">
                      <span className="badge badge-gray">{service.category}</span>
                    </td>
                    <td data-label="Duration" style={{ whiteSpace: 'nowrap', color: '#111827', fontWeight: '500' }}>
                      {service.durationMinutes} min
                    </td>
                    <td data-label="Pricing">
                      {service.discountedPrice < service.price && (
                        <span className="price-original">₹{service.price.toFixed(2)}</span>
                      )}
                      <span className="price-main">₹{service.effectivePrice.toFixed(2)}</span>
                      <div className="price-label">Effective: ₹{service.effectivePrice.toFixed(2)}</div>
                    </td>
                    <td data-label="Status">
                      <div className="status-badges">
                        {service.isActive
                          ? <span className="badge badge-green"><span className="badge-dot"></span>Active</span>
                          : <span className="badge badge-gray"><span className="badge-dot"></span>Inactive</span>
                        }
                        {service.isPopular && (
                          <span className="badge badge-popular">⭐ Popular</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Bookings" style={{ fontWeight: '500', color: '#111827' }}>{service.totalBookings || 0}</td>
                    <td data-label="Staff">
                      {(service.staffCount || 0) === 0 ? (
                        <span className="staff-zero">
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          0 Staff
                        </span>
                      ) : (
                        <span style={{ fontWeight: '500', color: '#111827' }}>{service.staffCount} Staff</span>
                      )}
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button className="btn-view-details" onClick={() => setMobileServiceDetails(service)}>
                          View Details
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
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing page {currentPage + 1} of {totalPages}
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <div className="page-btn current">{currentPage + 1}</div>
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal - Create Service (Keep original modal look or slightly modernise it? User mock didn't show modal, so I'll keep the existing one but styled better) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1B3F6E] p-8 text-white relative">
              <h2 className="text-2xl font-bold leading-none mb-2">ADD NEW SERVICE</h2>
              <p className="text-white opacity-80 font-bold text-xs uppercase tracking-widest">Expand your business menu</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                    placeholder="e.g. Hair Cut & Styling"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all h-20 text-sm"
                    placeholder="Detail what makes this service special..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration (Min)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={form.discountedPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-[#1B3F6E]"
                  />
                </div>

                {/* <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all text-sm"
                    placeholder="https://..."
                  />
                </div> */}
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#1B3F6E]"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1B3F6E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#152f55] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Update Service */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1B3F6E] p-8 text-white relative">
              <h2 className="text-2xl font-bold leading-none mb-2">UPDATE SERVICE</h2>
              <p className="text-white opacity-80 font-bold text-xs uppercase tracking-widest">Edit service details</p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateForm.name}
                    onChange={handleUpdateChange}
                    required
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                    placeholder="e.g. Premium Hair Cut & Styling"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={updateForm.category}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration (Min)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={updateForm.durationMinutes}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={updateForm.price}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={updateForm.discountedPrice}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-[#1B3F6E]"
                  />
                </div>

                {/* <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={updateForm.imageUrl}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all text-sm"
                    placeholder="https://..."
                  />
                </div> */}
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={updateForm.isPopular}
                    onChange={handleUpdateChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-[#1B3F6E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#152f55] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Details Modal */}
      {mobileServiceDetails && (
        <div className="fixed inset-0 z-[9999] md:hidden flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black-deep/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setMobileServiceDetails(null)} 
          />
          <div 
            className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col z-10 relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="font-bold text-black-deep text-lg">Service Details</h3>
              <button onClick={() => setMobileServiceDetails(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <div className="space-y-6 overflow-y-auto custom-scrollbar pb-4">
              {/* Image & Basic Info */}
              {/* <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  {mobileServiceDetails.imageUrl ? (
                    <img src={mobileServiceDetails.imageUrl} alt={mobileServiceDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gold/5 text-gold">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-black-deep leading-tight">{mobileServiceDetails.name}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">{mobileServiceDetails.category}</div>
                </div>
              </div> */}

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Description</p>
                <p className="text-xs text-secondary leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50 italic">
                  "{mobileServiceDetails.description || "No description available."}"
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FDFBF7] p-3 rounded-2xl border border-gold/10">
                  <div className="text-[9px] text-secondary/50 uppercase font-bold tracking-widest mb-1">Pricing</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-black-deep">₹{mobileServiceDetails.effectivePrice}</span>
                    {mobileServiceDetails.discountedPrice < mobileServiceDetails.price && (
                      <span className="text-[10px] text-secondary/40 line-through">₹{mobileServiceDetails.price}</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[9px] text-secondary/50 uppercase font-bold tracking-widest mb-1">Duration</div>
                  <div className="text-sm font-bold text-black-deep">{mobileServiceDetails.durationMinutes} min</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[9px] text-secondary/50 uppercase font-bold tracking-widest mb-1">Status</div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${mobileServiceDetails.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-sm font-bold text-black-deep">{mobileServiceDetails.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[9px] text-secondary/50 uppercase font-bold tracking-widest mb-1">Total Bookings</div>
                  <div className="text-sm font-bold text-black-deep">{mobileServiceDetails.totalBookings || 0}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2 shrink-0">
              <button onClick={() => { setMobileServiceDetails(null); openUpdateModal(mobileServiceDetails); }} className="flex-1 py-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                Edit
              </button>
              <button onClick={() => { setMobileServiceDetails(null); openDeleteModal(mobileServiceDetails); }} className="flex-1 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
