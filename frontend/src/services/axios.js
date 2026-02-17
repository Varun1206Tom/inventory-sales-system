import axios from "axios";

const BASE_URL = 'http://localhost:5000/api';

const API = axios.create({
    baseURL: BASE_URL,
});


// ✅ REQUEST INTERCEPTOR (Attach Token)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = token;
            // OR if using Bearer:
            // config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ✅ RESPONSE INTERCEPTOR (Global Error Handling)
API.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {
            console.log("Unauthorized → Redirecting to Login");

            localStorage.clear();
            window.location.href = "/";
        }

        if (error.response?.status === 403) {
            console.log("Forbidden Access");
        }

        return Promise.reject(error);
    }
);

export default API;