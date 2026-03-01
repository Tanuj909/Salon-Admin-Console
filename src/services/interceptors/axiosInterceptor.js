import axiosConfig from './axiosConfig';

const setupInterceptors = (navigate, logout) => {
    // Request Interceptor
    axiosConfig.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    axiosConfig.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Handle 401 Unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                // If we had a refresh token flow, it would go here
                // For now, we logout on 401
                logout();
                navigate('/login');
                return Promise.reject(error);
            }

            // Handle 403 Forbidden
            if (error.response?.status === 403) {
                // Handle role-based access denial
                console.error('Access forbidden');
            }

            return Promise.reject(error);
        }
    );
};

export default setupInterceptors;
