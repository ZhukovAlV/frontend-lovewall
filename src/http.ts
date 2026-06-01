import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_AUTH_SERVICE_URL || "http://192.168.1.99:8080",
    headers: { "Content-Type": "application/json" }
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export default instance;
