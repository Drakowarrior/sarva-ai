import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api"
});

// Automatically inject Authorization header with JWT and X-User-Id to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sarvaai_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    let userId = localStorage.getItem("sarvaai_user_id");
    if (!userId) {
      const chars = "0123456789abcdef";
      userId = "";
      for (let i = 0; i < 24; i++) {
        userId += chars[Math.floor(Math.random() * 16)];
      }
      localStorage.setItem("sarvaai_user_id", userId);
    }
    config.headers["X-User-Id"] = userId;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;