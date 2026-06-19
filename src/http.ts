import axios from "axios";

// Определяем base URL в зависимости от окружения
const getBaseURL = () => {
    return import.meta.env.VITE_API_AUTH_SERVICE_URL || "http://localhost:8080";
};

const instance = axios.create({
    baseURL: getBaseURL(),
    headers: { "Content-Type": "application/json" }
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export default instance;
