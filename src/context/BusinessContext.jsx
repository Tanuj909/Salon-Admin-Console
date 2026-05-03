import { createContext, useContext, useState, useEffect } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { useAuth } from "@/features/auth/hooks/useAuth";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
    const { user } = useAuth();
    const [businessId, setBusinessId] = useState(null);
    const [businessData, setBusinessData] = useState(null);
    // Start loading=true for roles that need business data, so pages don't flash "no data"
    const needsBusiness = user && user.role !== "SUPER_ADMIN";
    const [loading, setLoading] = useState(needsBusiness);

    useEffect(() => {
        // Only fetch for roles that have a business (ADMIN, RECEPTIONIST, STAFF)
        if (!user || user.role === "SUPER_ADMIN") {
            setLoading(false);
            return;
        }

        const fetchBusiness = async () => {
            try {
                setLoading(true);
                
                if (user?.role === "RECEPTIONIST" || user?.role === "STAFF") {
                    // For Receptionist and Staff, prioritize businessId from profile
                    if (user?.businessId) {
                        setBusinessId(user.businessId);
                        try {
                            // Try to get full business data if needed
                            const data = await getMyBusinessApi();
                            if (data && data.id) setBusinessData(data);
                        } catch (err) {
                            console.warn("Could not fetch full business data for", user.role);
                        }
                    }
                } else {
                    // Admin flow remains exactly as it was
                    const data = await getMyBusinessApi();
                    if (data && data.id) {
                        setBusinessId(data.id);
                        setBusinessData(data);
                    }
                }
            } catch (err) {
                console.error("Error fetching business data", err);
            } finally {
                setLoading(false);
            }
        };

        if (!businessId || (user?.businessId && businessId !== user?.businessId)) {
            fetchBusiness();
        }
    }, [user]);

    const refreshBusiness = async () => {
        try {
            const data = await getMyBusinessApi();
            setBusinessId(data.id);
            setBusinessData(data);
            return data;
        } catch (err) {
            console.error("Error refreshing business data", err);
        }
    };

    return (
        <BusinessContext.Provider value={{ businessId, businessData, loading, refreshBusiness }}>
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }
    return context;
};
