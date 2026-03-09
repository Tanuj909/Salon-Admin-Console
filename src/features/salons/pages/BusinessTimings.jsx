import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getBusinessTimingsApi, updateBusinessTimingsApi } from "../services/timingService";
import { useBusiness } from "@/context/BusinessContext";

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const BusinessTimings = () => {
    const { user } = useAuth();
    const { businessId } = useBusiness();
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [timings, setTimings] = useState([]);

    useEffect(() => {
        if (businessId) fetchData();
    }, [businessId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setSalon({ id: businessId });
            const timingsData = await getBusinessTimingsApi(businessId);

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
                        return { dayOfWeek: t.dayOfWeek, isClosed: true };
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige to-cream font-jost">
                <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 bg-gradient-to-br from-beige to-cream font-jost">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">

                {/* Compact Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-black-deep flex items-center justify-center shadow-sm">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-black-deep leading-tight">Business Timings</h1>
                            <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Weekly Operating Schedule</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gold text-black-deep text-[10px] font-extrabold uppercase tracking-widest rounded-full hover:brightness-105 hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-3 h-3 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : "Save Timings"}
                    </button>
                </div>

                {/* Timings Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-[#FDFBF7] border-b border-gold/10 text-[9px] uppercase tracking-[0.2em] text-secondary font-extrabold">
                        <div className="col-span-3">Day</div>
                        <div className="col-span-3">Status</div>
                        <div className="col-span-3 text-center">Opens At</div>
                        <div className="col-span-3 text-center">Closes At</div>
                    </div>

                    {/* Timing Rows */}
                    <div className="divide-y divide-gold/5">
                        {timings.map((timing, index) => (
                            <div
                                key={timing.dayOfWeek}
                                className={`grid grid-cols-12 gap-4 items-center px-5 py-3 transition-all hover:bg-[#FDFBF7] ${timing.isClosed ? 'opacity-60' : ''}`}
                            >
                                {/* Day Name */}
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-gold/10 to-gold/25 flex items-center justify-center text-[9px] font-extrabold text-gold uppercase tracking-wider">
                                        {timing.dayOfWeek.slice(0, 3)}
                                    </span>
                                    <span className="text-sm font-bold text-black-deep capitalize hidden sm:block">
                                        {timing.dayOfWeek.charAt(0) + timing.dayOfWeek.slice(1).toLowerCase()}
                                    </span>
                                </div>

                                {/* Status Toggle */}
                                <div className="col-span-3 flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer gap-2">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={timing.isClosed}
                                            onChange={(e) => handleChange(index, "isClosed", e.target.checked)}
                                        />
                                        <div className="w-9 h-5 bg-green-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-400/30 shadow-inner"></div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${timing.isClosed ? 'text-red-500' : 'text-green-600'}`}>
                                            {timing.isClosed ? 'Closed' : 'Open'}
                                        </span>
                                    </label>
                                </div>

                                {/* Open Time */}
                                <div className="col-span-3">
                                    <input
                                        type="time"
                                        value={timing.openTime || ""}
                                        disabled={timing.isClosed}
                                        onChange={(e) => handleChange(index, "openTime", e.target.value)}
                                        className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs text-black-deep focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:bg-slate-50 disabled:text-slate-300 transition-all font-semibold"
                                    />
                                </div>

                                {/* Close Time */}
                                <div className="col-span-3">
                                    <input
                                        type="time"
                                        value={timing.closeTime || ""}
                                        disabled={timing.isClosed}
                                        onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                                        className="w-full bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs text-black-deep focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:bg-slate-50 disabled:text-slate-300 transition-all font-semibold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessTimings;
