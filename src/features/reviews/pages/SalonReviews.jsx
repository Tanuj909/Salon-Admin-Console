import React, { useEffect, useState } from "react";
import { getReviewsByBusinessApi, deleteReviewApi, updateReviewApi } from "@/features/reviews/services/reviewService";
import { useBusiness } from "@/context/BusinessContext";

const SalonReviews = () => {
    const { businessId, loading: businessLoading } = useBusiness();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Edit Modal State
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ rating: 5, comment: "", isAnonymous: false });
    const [isUpdating, setIsUpdating] = useState(false);

    // Mobile View State
    const [mobileReviewDetails, setMobileReviewDetails] = useState(null);

    const fetchReviews = async (sid, p) => {
        try {
            const reviewsData = await getReviewsByBusinessApi(sid, { page: p, size: pageSize });
            setReviews(reviewsData.content || []);
            setTotalPages(reviewsData.totalPages || 0);
            setTotalElements(reviewsData.totalElements || 0);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews.");
        }
    };

    useEffect(() => {
        if (!businessId) return;
        const fetchReviewsPage = async () => {
            try {
                setLoading(true);
                await fetchReviews(businessId, page);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviewsPage();
    }, [page, businessId]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        try {
            await deleteReviewApi(id);
            // Refresh reviews
            fetchReviews(businessId, page);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete review.");
        }
    };

    const openEditModal = (review) => {
        setEditingReview(review);
        setEditForm({
            rating: review.rating,
            comment: review.comment,
            isAnonymous: review.isAnonymous || false
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            await updateReviewApi(editingReview.id, editForm);
            setEditingReview(null);
            fetchReviews(businessId, page);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update review.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className={`flex gap-1 ${interactive ? 'text-amber-400' : 'text-gold'}`}>
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        width={interactive ? "28" : "18"}
                        height={interactive ? "28" : "18"}
                        viewBox="0 0 24 24"
                        fill={i < Math.floor(rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
                        onClick={() => interactive && onRatingChange(i + 1)}
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if ((loading || businessLoading) && page === 0) {
        return (
            <div className="w-full flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                    <span className="text-secondary font-medium tracking-wider uppercase text-sm">Loading Reviews...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
            <div className="container mx-auto px-4 sm:px-6 pb-12 pt-4 bg-transparent max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-4xl italic text-black-deep mb-2">Customer Reviews</h1>
                        <p className="text-secondary text-base">Manage and monitor what your customers are saying.</p>
                    </div>
                    <div className="text-right bg-white px-6 py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4">
                        <div className="text-xs text-secondary font-bold uppercase tracking-widest text-left">Total<br />Feedback</div>
                        <div className="text-3xl font-display font-bold text-gold">{totalElements}</div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium flex items-center gap-3 shadow-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                )}

                {reviews.length === 0 ? (
                    <div className="bg-white rounded-[24px] py-24 px-8 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-black-deep mb-2">No reviews yet</h3>
                        <p className="text-secondary max-w-sm mx-auto">When customers leave feedback for your salon or services, it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-[20px] md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-gold/30 group">
                                {/* Desktop Layout */}
                                <div className="hidden md:flex flex-row gap-5">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                {renderStars(review.rating)}
                                                <span className="text-lg font-bold text-black-deep leading-none mt-0.5">{Number(review.rating).toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                    {formatDate(review.createdAt)}
                                                </span>
                                                {/* Action Buttons */}
                                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(review)}
                                                        className="w-8 h-8 flex items-center justify-center text-secondary hover:text-gold hover:bg-gold/10 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                        title="Edit Review"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="w-8 h-8 flex items-center justify-center text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                        title="Delete Review"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-black-deep leading-relaxed text-[14px] font-medium my-2">
                                            "{review.comment}"
                                        </p>
                                        {review.imageUrls && review.imageUrls.length > 0 && (
                                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar">
                                                {review.imageUrls.map((url, idx) => (
                                                    <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                                        <img src={url} alt="Review attachment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-[280px] shrink-0 flex flex-col gap-3 border-l pl-5 border-slate-100 justify-center">
                                        <div className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">
                                            <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0">
                                                <img src={review.customer?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.isAnonymous ? "A" : (review.customer?.fullName || "A")) + "&background=FDFBF7&color=C8A951"} className="w-full h-full object-cover" alt="Customer" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-sm font-bold text-black-deep truncate">{review.isAnonymous ? "Anonymous User" : review.customer?.fullName}</div>
                                                <div className="text-[10px] text-secondary uppercase font-bold tracking-widest mt-0.5">Customer</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {review.staff && (
                                                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white hover:border-gold/30 transition-colors flex-1 min-w-0">
                                                    <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0">
                                                        <img src={review.staff?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.staff?.fullName || "S") + "&background=F8FAFC&color=64748B"} className="w-full h-full object-cover" alt="Staff" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-xs font-bold text-black-deep truncate">{review.staff.fullName}</div>
                                                        <div className="text-[9px] text-secondary uppercase font-bold tracking-widest mt-0.5">Specialist</div>
                                                    </div>
                                                </div>
                                            )}

                                            {review.booking && (
                                                <div className="bg-[#FDFBF7] rounded-xl p-2 border border-gold/20 relative overflow-hidden flex-1 min-w-0 flex flex-col justify-center">
                                                    <div className="absolute -right-2 -top-2 text-gold/10">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" /></svg>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="text-[9px] text-secondary uppercase font-bold tracking-widest mb-0.5">
                                                            Ref No.
                                                        </div>
                                                        <div className="text-xs font-bold text-black-deep truncate">{review.booking.bookingNumber}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                 {/* Mobile Layout - Premium Card Style */}
                                 <div className="md:hidden flex flex-col gap-4">
                                     <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-full border-2 border-gold/10 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                                                 <img src={review.customer?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.isAnonymous ? "A" : (review.customer?.fullName || "A")) + "&background=FDFBF7&color=C8A951"} className="w-full h-full object-cover" alt="Customer" />
                                             </div>
                                             <div>
                                                 <div className="text-sm font-bold text-black-deep leading-tight">{review.isAnonymous ? "Anonymous User" : review.customer?.fullName}</div>
                                                 <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-0.5">{formatDate(review.createdAt)}</div>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-1 bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/20">
                                             <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gold"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                             <span className="font-bold text-xs text-black-deep">{Number(review.rating).toFixed(1)}</span>
                                         </div>
                                     </div>
                                     
                                     <p className="text-secondary text-sm leading-relaxed line-clamp-2 italic font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                                         "{review.comment}"
                                     </p>
                                     
                                     <button
                                         onClick={() => setMobileReviewDetails(review)}
                                         className="w-full py-3.5 bg-black-deep text-gold rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] hover:brightness-125 transition-all shadow-md active:scale-[0.98]"
                                     >
                                         View Full Feedback
                                     </button>
                                 </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 pb-10">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 transition-colors bg-white cursor-pointer text-slate-600"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <span className="text-sm font-bold text-secondary uppercase tracking-wider px-4">Page {page + 1} of {totalPages}</span>
                                <button
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 hover:border-slate-300 transition-colors bg-white cursor-pointer text-slate-600"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}



                {/* Mobile View Details Modal */}
                {mobileReviewDetails && (
                    <div className="fixed inset-0 z-[9999] md:hidden flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-black-deep/80 backdrop-blur-md animate-in fade-in duration-300" 
                            onClick={() => setMobileReviewDetails(null)} 
                        />
                        <div 
                            className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col z-10 relative overflow-hidden" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h3 className="font-bold text-black-deep text-lg">Review Details</h3>
                                <button onClick={() => setMobileReviewDetails(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                            
                            <div className="space-y-6 overflow-y-auto custom-scrollbar pb-4">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div>
                                        <div className="text-sm font-bold text-black-deep">{mobileReviewDetails.isAnonymous ? "Anonymous User" : mobileReviewDetails.customer?.fullName}</div>
                                        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">
                                            {formatDate(mobileReviewDetails.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                            <span className="text-gold">★</span>
                                            <span className="font-bold text-black-deep">{Number(mobileReviewDetails.rating).toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Comment</p>
                                    <p className="text-sm text-black-deep leading-relaxed">"{mobileReviewDetails.comment}"</p>
                                </div>

                                {(mobileReviewDetails.staff || mobileReviewDetails.booking) && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {mobileReviewDetails.staff && (
                                            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-white">
                                                <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0">
                                                    <img src={mobileReviewDetails.staff?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (mobileReviewDetails.staff?.fullName || "S") + "&background=F8FAFC&color=64748B"} className="w-full h-full object-cover" alt="Staff" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-black-deep truncate">{mobileReviewDetails.staff.fullName}</div>
                                                    <div className="text-[9px] text-secondary uppercase font-bold tracking-widest mt-0.5">Specialist</div>
                                                </div>
                                            </div>
                                        )}
                                        {mobileReviewDetails.booking && (
                                            <div className="flex items-center gap-2 p-3 rounded-xl border border-gold/20 bg-[#FDFBF7]">
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-black-deep truncate">{mobileReviewDetails.booking.bookingNumber}</div>
                                                    <div className="text-[9px] text-secondary uppercase font-bold tracking-widest mt-0.5">Booking Ref</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {mobileReviewDetails.imageUrls && mobileReviewDetails.imageUrls.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Attachments</p>
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {mobileReviewDetails.imageUrls.map((url, idx) => (
                                                <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={url} alt="Review attachment" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2 shrink-0">
                                <button onClick={() => { setMobileReviewDetails(null); openEditModal(mobileReviewDetails); }} className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    Edit
                                </button>
                                <button onClick={() => { setMobileReviewDetails(null); handleDelete(mobileReviewDetails.id); }} className="flex-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalonReviews;
