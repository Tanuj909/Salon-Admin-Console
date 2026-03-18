import React, { useEffect, useState } from "react";
import { getReviewsByBusinessApi, deleteReviewApi, updateReviewApi } from "@/features/reviews/services/reviewService";
import { useBusiness } from "@/context/BusinessContext";

const SalonReviews = () => {
    const { businessId } = useBusiness();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading && page === 0) {
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
            <div className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
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
                            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-gold/30 group">
                                <div className="flex flex-col md:flex-row gap-5">
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

                                    <div className="md:w-[280px] shrink-0 flex flex-col gap-3 pt-4 md:pt-0 md:border-l md:pl-5 border-slate-100 justify-center">
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

                {/* Edit Modal Overlay */}
                {editingReview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-deep/60 backdrop-blur-sm transition-opacity">
                        <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                            <div className="px-8 py-6 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
                                <div>
                                    <h3 className="font-display text-2xl italic text-black-deep m-0">Update Review</h3>
                                    <p className="text-sm text-secondary mt-1">Modify the customer feedback</p>
                                </div>
                                <button onClick={() => setEditingReview(null)} className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                                <div className="p-8 pb-4">
                                    <div className="mb-8">
                                        <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Overall Rating</label>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block">
                                            {renderStars(editForm.rating, true, (val) => setEditForm(prev => ({ ...prev, rating: val })))}
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Review Comment</label>
                                        <textarea
                                            className="w-full h-36 px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-sm text-black-deep resize-none placeholder:text-slate-400"
                                            value={editForm.comment}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Write your updated feedback here..."
                                            required
                                        />
                                    </div>
                                    <div className="mb-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={(e) => {
                                        // Toggle checkbox logically if clicking row, except if clicking input directly
                                        if (e.target.tagName !== 'INPUT') {
                                            setEditForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))
                                        }
                                    }}>
                                        <div>
                                            <div className="text-sm font-bold text-black-deep">Anonymous Review</div>
                                            <div className="text-xs text-secondary mt-0.5">Hide customer name publicly</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            id="isAnon"
                                            checked={editForm.isAnonymous}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold pointer-events-auto"
                                        />
                                    </div>
                                </div>

                                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 mt-auto shrink-0 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingReview(null)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors bg-white uppercase tracking-wider text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gold text-black-deep font-bold hover:bg-gold/80 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 border-0 uppercase tracking-wider text-xs"
                                    >
                                        {isUpdating ? "Updating..." : "Save Changes"}
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

export default SalonReviews;
