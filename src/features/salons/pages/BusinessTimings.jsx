import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBusinessTimingsApi, updateBusinessTimingsApi } from "../services/timingService";
import { getMyBusinessApi } from "../services/salonService";

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const BusinessTimings = () => {
    const { user } = useAuth();
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [timings, setTimings] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const businessData = await getMyBusinessApi();
            if (!businessData?.id) throw new Error("Business not found");

            setSalon(businessData);
            const timingsData = await getBusinessTimingsApi(businessData.id);

            // Ensure all days are represented in state
            const safeTimingsData = Array.isArray(timingsData) ? timingsData : [];
            const initialTimings = DAYS_OF_WEEK.map((day) => {
                const existingTiming = safeTimingsData.find((t) => t.dayOfWeek === day);
                if (existingTiming) {
                    return {
                        dayOfWeek: existingTiming.dayOfWeek,
                        openTime: existingTiming.openTime || "09:00",
                        closeTime: existingTiming.closeTime || "18:00",
                        isClosed: existingTiming.isClosed,
                    };
                }
                return {
                    dayOfWeek: day,
                    openTime: "09:00",
                    closeTime: "18:00",
                    isClosed: false,
                };
            });

            setTimings(initialTimings);
        } catch (error) {
            console.error("Failed to fetch data", error);
            // Fallback initialization if API fails
            const fallbackTimings = DAYS_OF_WEEK.map((day) => ({
                dayOfWeek: day,
                openTime: "09:00",
                closeTime: "18:00",
                isClosed: false,
            }));
            setTimings(fallbackTimings);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedTimings = [...timings];
        updatedTimings[index] = {
            ...updatedTimings[index],
            [field]: value,
        };
        if (field === "isClosed" && value) {
            updatedTimings[index].openTime = null;
            updatedTimings[index].closeTime = null;
        } else if (field === "isClosed" && !value) {
            updatedTimings[index].openTime = "09:00";
            updatedTimings[index].closeTime = "18:00";
        }
        setTimings(updatedTimings);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                timings: timings.map(t => {
                    if (t.isClosed) {
                        return {
                            dayOfWeek: t.dayOfWeek,
                            isClosed: true
                        };
                    }
                    return {
                        dayOfWeek: t.dayOfWeek,
                        openTime: t.openTime,
                        closeTime: t.closeTime,
                        isClosed: false
                    };
                })
            };
            await updateBusinessTimingsApi(salon.id, payload);
            alert("Timings saved successfully!");
        } catch (error) {
            console.error("Failed to save timings", error);
            alert("Failed to save timings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-beige to-cream font-jost">
                <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-beige to-cream font-jost">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold mb-4 block">Schedule</span>
                    <h1 className="font-display text-4xl text-black-deep tracking-wide font-light">
                        Business <em className="italic text-gold">Timings</em>
                    </h1>
                    <p className="text-secondary mt-3">Manage your salon's operating hours and weekly closures.</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gold/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                        {/* Header Row */}
                        <div className="hidden sm:grid grid-cols-12 gap-6 pb-4 border-b border-gold/10 px-6 text-xs uppercase tracking-widest text-secondary font-bold">
                            <div className="col-span-3">Day</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-3 text-center">Open Time</div>
                            <div className="col-span-3 text-center">Close Time</div>
                        </div>

                        {/* Timing Rows */}
                        {timings.map((timing, index) => (
                            <div
                                key={timing.dayOfWeek}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center p-6 bg-beige/50 rounded-2xl border border-transparent hover:border-gold/20 transition-all group"
                            >
                                {/* Day Name */}
                                <div className="col-span-12 sm:col-span-3">
                                    <span className="font-display text-lg text-black-deep font-semibold capitalize tracking-wide">
                                        {timing.dayOfWeek.toLowerCase()}
                                    </span>
                                </div>

                                {/* Status Toggle */}
                                <div className="col-span-12 sm:col-span-3 flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={timing.isClosed}
                                            onChange={(e) => handleChange(index, "isClosed", e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-green-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500/20 shadow-inner"></div>
                                        <span className={`ml-3 text-xs font-bold uppercase tracking-widest transition-colors ${timing.isClosed ? 'text-red-500' : 'text-green-600'}`}>
                                            {timing.isClosed ? 'Closed' : 'Open'}
                                        </span>
                                    </label>
                                </div>

                                {/* Time Inputs */}
                                <div className="col-span-12 sm:col-span-6 grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="sm:hidden text-[10px] uppercase tracking-wider text-secondary mb-1">Open Time</div>
                                        <input
                                            type="time"
                                            value={timing.openTime || ""}
                                            disabled={timing.isClosed}
                                            onChange={(e) => handleChange(index, "openTime", e.target.value)}
                                            className="w-full bg-white border border-gold/20 rounded-xl px-4 py-3 text-sm text-black-deep focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-gray-50 disabled:text-gray-400 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="sm:hidden text-[10px] uppercase tracking-wider text-secondary mb-1">Close Time</div>
                                        <input
                                            type="time"
                                            value={timing.closeTime || ""}
                                            disabled={timing.isClosed}
                                            onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                                            className="w-full bg-white border border-gold/20 rounded-xl px-4 py-3 text-sm text-black-deep focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-gray-50 disabled:text-gray-400 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-gold/10 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-10 py-4 bg-gold text-black-deep text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold/80 hover:-translate-y-1 transition-all shadow-[0_4px_20px_-5px_rgba(200,169,81,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                        >
                            {saving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black-deep/20 border-t-black-deep rounded-full animate-spin" />
                                    Saving...
                                </div>
                            ) : (
                                "Save Timings"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessTimings;
