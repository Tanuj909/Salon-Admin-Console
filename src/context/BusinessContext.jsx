import { createContext, useContext, useState, useEffect } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { useAuth } from "@/features/auth/hooks/useAuth";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
    const { user } = useAuth();
    const [businessId, setBusinessId] = useState(null);
    const [businessData, setBusinessData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only fetch for roles that have a business (ADMIN, RECEPTIONIST)
        if (!user || user.role === "SUPER_ADMIN") return;

        const fetchBusiness = async () => {
            try {
                setLoading(true);
                const data = await getMyBusinessApi();
                setBusinessId(data.id);
                setBusinessData(data);
            } catch (err) {
                console.error("Error fetching business data", err);
            } finally {
                setLoading(false);
            }
        };

        if (!businessId) {
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
