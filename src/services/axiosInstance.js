import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_BACKEND_URL || "https://api.chain4good.io.vn",
  timeout: 120000,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await instance.post("/auth/refresh");
        return instance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
