import React, { useEffect, useState } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getReviewsByBusinessApi, deleteReviewApi, updateReviewApi } from "../services/reviewService";

const SalonReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salonId, setSalonId] = useState(null);

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
        const fetchSalonAndReviews = async () => {
            try {
                setLoading(true);
                const salonData = await getMyBusinessApi();
                if (salonData && salonData.id) {
                    setSalonId(salonData.id);
                    await fetchReviews(salonData.id, page);
                } else {
                    setError("Could not identify your salon.");
                }
            } catch (err) {
                console.error("Error fetching salon data:", err);
                setError("Failed to load salon details.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalonAndReviews();
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        try {
            await deleteReviewApi(id);
            // Refresh reviews
            fetchReviews(salonId, page);
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
            fetchReviews(salonId, page);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update review.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        width={interactive ? "24" : "16"}
                        height={interactive ? "24" : "16"}
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
                {!interactive && <span className="ml-2 text-sm font-semibold text-gray-700">{rating}</span>}
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
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Reviews</h1>
                    <p className="text-gray-500 mt-2">Manage and monitor what your customers are saying.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Total Feedback</div>
                    <div className="text-2xl font-bold text-indigo-600">{totalElements}</div>
                </div>
            </header>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        {renderStars(review.rating)}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                {formatDate(review.createdAt)}
                                            </span>
                                            {/* Action Buttons */}
                                            <div className="hidden group-hover:flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(review)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                    title="Edit Review"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                    title="Delete Review"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-lg italic">
                                        "{review.comment}"
                                    </p>
                                    {review.imageUrls && review.imageUrls.length > 0 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {review.imageUrls.map((url, idx) => (
                                                <img key={idx} src={url} alt="Review attachment" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="md:w-72 flex flex-col gap-4 pt-4 md:pt-0 md:border-l md:pl-6 border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.customer?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.customer?.fullName || "A")}
                                            className="w-10 h-10 rounded-full border border-gray-100"
                                            alt="Customer"
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{review.isAnonymous ? "Anonymous User" : review.customer?.fullName}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Customer</div>
                                        </div>
                                    </div>

                                    {review.staff && (
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.staff?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.staff?.fullName || "S")}
                                                className="w-10 h-10 rounded-full border border-gray-100"
                                                alt="Staff"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-700">{review.staff.fullName}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Specialist</div>
                                            </div>
                                        </div>
                                    )}

                                    {review.booking && (
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Booking Ref</div>
                                            <div className="text-xs font-mono text-indigo-600 font-bold">{review.booking.bookingNumber}</div>
                                            <div className="text-[10px] text-gray-500 mt-1">{formatDate(review.booking.bookingDate)}</div>
                                        </div>
                                    )}
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
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <span className="text-sm font-medium text-gray-600">Page {page + 1} of {totalPages}</span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal Overlay */}
            {editingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Update Review</h3>
                            <button onClick={() => setEditingReview(null)} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Overall Rating</label>
                                {renderStars(editForm.rating, true, (val) => setEditForm(prev => ({ ...prev, rating: val })))}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Review Comment</label>
                                <textarea
                                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-[inherit] resize-none"
                                    value={editForm.comment}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Write your updated feedback here..."
                                    required
                                />
                            </div>
                            <div className="mb-8 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAnon"
                                    checked={editForm.isAnonymous}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="isAnon" className="text-sm text-gray-600 font-medium cursor-pointer">Post as Anonymous</label>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all bg-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 border-0 cursor-pointer"
                                >
                                    {isUpdating ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalonReviews;
