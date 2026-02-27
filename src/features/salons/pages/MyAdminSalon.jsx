import { useState, useEffect } from "react";
import { getMyBusinessApi } from "../services/salonService";

const MyAdminSalon = () => {
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMySalon = async () => {
            try {
                setLoading(true);
                const data = await getMyBusinessApi();
                setSalon(data);
            } catch (err) {
                setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMySalon();
    }, []);

    if (loading) return (
        <div className="page active">
            <div className="text-center py-20 text-slate-400 animate-pulse">Loading Your Salon Profile...</div>
        </div>
    );
    
    if (error) return (
        <div className="page active">
            <div className="admin-card max-w-lg mx-auto mt-12 p-8 text-center border-red-100">
                <span className="text-4xl mb-4 block">⚠️</span>
                <h3 className="text-red-600 font-bold text-lg mb-2">Access Error</h3>
                <p className="text-slate-500 text-sm">{error}</p>
            </div>
        </div>
    );

    if (!salon) return (
        <div className="page active">
            <div className="text-center py-20 text-slate-400">No salon data found for your account.</div>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date).replace(',', ' ·');
    };

    return (
        <div className="page active" style={{ minHeight: '100vh', padding: '0' }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

                .admin-salon-container {
                    font-family: 'DM Sans', sans-serif;
                    color: #374151;
                    padding: 32px;
                    width: 100%;
                    margin: 0 auto;
                }

                .admin-salon-container *, .admin-salon-container *::before, .admin-salon-container *::after { 
                    box-sizing: border-box; 
                }

                .page-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }

                .page-header-left h1 {
                    font-family: 'Syne', sans-serif;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1F2937;
                    letter-spacing: -0.4px;
                    margin: 0;
                }

                .page-header-left p {
                    font-size: 13.5px;
                    color: #6B7280;
                    margin-top: 5px;
                    max-width: 480px;
                    line-height: 1.5;
                }

                .page-header-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 10px;
                }

                .badges {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 11px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .badge-green {
                    background: #ECFDF5;
                    color: #065F46;
                    border: 1px solid #A7F3D0;
                }

                .badge-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: currentColor;
                }

                .btn-group { display: flex; gap: 10px; }

                .btn {
                    padding: 8px 18px;
                    border-radius: 7px;
                    font-size: 13.5px;
                    font-weight: 500;
                    cursor: pointer;
                    border: 1px solid transparent;
                    font-family: 'DM Sans', sans-serif;
                    transition: all 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-primary {
                    background: #1E4D7B;
                    color: white;
                    border-color: #1E4D7B;
                }

                .btn-primary:hover { background: #163d63; }

                .btn-outline-red {
                    background: transparent;
                    color: #B91C1C;
                    border-color: #FECACA;
                }

                .btn-outline-red:hover { background: #FEF2F2; }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 16px;
                }

                @media (max-width: 1024px) {
                    .grid-2, .grid-3 { grid-template-columns: 1fr; }
                }

                .card {
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    padding: 22px 24px;
                }

                .card-title {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.7px;
                    color: #6B7280;
                    margin-bottom: 18px;
                    padding-bottom: 14px;
                    border-bottom: 1px solid #E5E7EB;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .card-title svg { color: #1E4D7B; }

                .field-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px 28px;
                }

                .field { display: flex; flex-direction: column; gap: 3px; }

                .field-label {
                    font-size: 11.5px;
                    color: #6B7280;
                    font-weight: 500;
                    letter-spacing: 0.2px;
                }

                .field-value {
                    font-size: 14px;
                    color: #1F2937;
                    font-weight: 600;
                }

                .field-value.mono {
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    letter-spacing: 0.3px;
                }

                .field-value a {
                    color: #1E4D7B;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 13px;
                }

                .field-value a:hover { text-decoration: underline; }

                .field-value .star-rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .stars { color: #D1D5DB; font-size: 13px; letter-spacing: 1px; }

                .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }

                .tag {
                    background: #F3F4F6;
                    color: #374151;
                    border: 1px solid #E5E7EB;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 12.5px;
                    font-weight: 500;
                }

                .tag-blue {
                    background: #EBF2FA;
                    color: #1E4D7B;
                    border-color: #BFDBFE;
                }

                .admin-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .admin-avatar {
                    width: 42px; height: 42px;
                    background: #1E4D7B;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 16px;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }

                .admin-info h3 {
                    font-size: 15px;
                    font-weight: 600;
                    color: #1F2937;
                    margin: 0;
                }

                .admin-info span {
                    font-size: 13px;
                    color: #6B7280;
                }

                .admin-meta {
                    margin-top: 16px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                .meta-desc {
                    font-size: 13.5px;
                    color: #374151;
                    line-height: 1.6;
                    background: #F8F9FA;
                    border: 1px solid #E5E7EB;
                    border-radius: 7px;
                    padding: 12px 14px;
                }

                .section-gap { margin-bottom: 16px; }


                `}
            </style>

            <main className="admin-salon-container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-header-left">
                        <h1>{salon.name}</h1>
                        <p>{salon.description}</p>
                    </div>
                    <div className="page-header-right">
                        <div className="badges">
                            {salon.verificationStatus === 'VERIFIED' && (
                                <span className="badge badge-green">
                                    <span className="badge-dot"></span>Verified
                                </span>
                            )}
                            <span className="badge badge-green">
                                <span className="badge-dot"></span>Open
                            </span>
                            <span className="badge badge-green">
                                <span className="badge-dot"></span>Domain Active
                            </span>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-primary">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Edit Business
                            </button>
                            <button className="btn btn-outline-red">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                Deactivate Business
                            </button>
                        </div>
                    </div>
                </div>

                {/* Row 1: Overview + Contact */}
                <div className="grid-2 section-gap">
                    {/* Business Overview */}
                    <div className="card">
                        <div className="card-title">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                            Business Overview
                        </div>
                        <div className="field-grid">
                            <div className="field">
                                <span className="field-label">Business ID</span>
                                <span className="field-value">#{salon.id}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Registration Number</span>
                                <span className="field-value mono">{salon.registrationNumber}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Created At</span>
                                <span className="field-value">{formatDate(salon.createdAt)}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Last Updated</span>
                                <span className="field-value">{formatDate(salon.updatedAt)}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Domain Activated At</span>
                                <span className="field-value">{formatDate(salon.domainActivatedAt || salon.updatedAt)}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Average Rating</span>
                                <span className="field-value">
                                    <span className="star-rating">
                                        <span className="stars">★★★★★</span>
                                        {salon.averageRating?.toFixed(2) || '0.00'}
                                    </span>
                                </span>
                            </div>
                            <div className="field">
                                <span className="field-label">Total Bookings</span>
                                <span className="field-value">{salon.totalBookings || 0}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Total Reviews</span>
                                <span className="field-value">{salon.totalReviews || 0}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">QR Code Status</span>
                                <span className="field-value">
                                    <span className="badge badge-green" style={{ padding: '3px 9px', fontSize: '10.5px' }}>
                                        <span className="badge-dot"></span>{salon.qrCodeStatus || 'Active'}
                                    </span>
                                </span>
                            </div>
                            <div className="field">
                                <span className="field-label">QR Code Scans</span>
                                <span className="field-value">{salon.qrCodeScanCount || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="card">
                        <div className="card-title">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            Contact & Location
                        </div>
                        <div className="field-grid">
                            <div className="field">
                                <span className="field-label">Phone Number</span>
                                <span className="field-value">{salon.phoneNumber}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Email Address</span>
                                <span className="field-value"><a href={`mailto:${salon.email}`}>{salon.email}</a></span>
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <span className="field-label">Full Address</span>
                                <span className="field-value">
                                    {salon.address}, {salon.city}, {salon.state}, {salon.postalCode} — {salon.country}
                                </span>
                            </div>
                            <div className="field">
                                <span className="field-label">Postal Code</span>
                                <span className="field-value mono">{salon.postalCode}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Domain Name</span>
                                <span className="field-value"><a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12.5px' }}>{salon.domainName}</a></span>
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <span className="field-label">Full Domain URL</span>
                                <span className="field-value">
                                    <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer">
                                        {salon.fullDomainUrl}
                                    </a>
                                </span>
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <span className="field-label">QR Code Redirect URL</span>
                                <span className="field-value">
                                    <a href={salon.qrCodeRedirectUrl || salon.fullDomainUrl} target="_blank" rel="noreferrer">
                                        {salon.qrCodeRedirectUrl || salon.fullDomainUrl}
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Admin + SEO + Categories */}
                <div className="grid-3 section-gap">
                    {/* Admin Info */}
                    <div className="card">
                        <div className="card-title">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            Admin Information
                        </div>
                        <div className="admin-row">
                            <div className="admin-avatar">{salon.adminName?.[0] || 'A'}</div>
                            <div className="admin-info">
                                <h3>{salon.adminName}</h3>
                                <span>ID: #{salon.adminId}</span>
                            </div>
                        </div>
                        <div className="admin-meta">
                            <div className="field">
                                <span className="field-label">Admin Name</span>
                                <span className="field-value">{salon.adminName}</span>
                            </div>
                            <div className="field">
                                <span className="field-label">Admin ID</span>
                                <span className="field-value">#{salon.adminId}</span>
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <span className="field-label">Admin Email</span>
                                <span className="field-value"><a href={`mailto:${salon.adminEmail}`}>{salon.adminEmail}</a></span>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="card">
                        <div className="card-title">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            SEO Information
                        </div>
                        <div className="field" style={{ marginBottom: '16px' }}>
                            <span className="field-label">Meta Description</span>
                            <div className="meta-desc" style={{ marginTop: '6px' }}>
                                {salon.metaDescription || `Luxury beauty treatments and hair services at ${salon.name}.`}
                            </div>
                        </div>
                        <div className="field">
                            <span className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Meta Keywords</span>
                            <div className="tag-list">
                                {salon.metaKeywords?.split(',').map((kw, i) => (
                                    <span key={i} className="tag">{kw.trim()}</span>
                                ))}
                                {(!salon.metaKeywords || salon.metaKeywords.length === 0) && (
                                    <span className="text-slate-400 text-xs italic">No keywords set</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="card">
                        <div className="card-title">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            Categories
                        </div>
                        <div className="field" style={{ marginBottom: '20px' }}>
                            <span className="field-label" style={{ marginBottom: '10px', display: 'block' }}>Assigned Categories</span>
                            <div className="tag-list">
                                {salon.categories?.map((cat) => (
                                    <span key={cat.id} className="tag tag-blue">{cat.name}</span>
                                ))}
                                {(!salon.categories || salon.categories.length === 0) && (
                                    <span className="text-slate-400 text-xs italic">No categories assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyAdminSalon;
