import axios from "axios";
import { getCookie } from "@/lib/cookie";

const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ============================
// REQUEST INTERCEPTOR
// ============================
privateApi.interceptors.request.use((config) => {
  const token = getCookie("access_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// RESPONSE INTERCEPTOR
// ============================
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refresh_token");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data?.accessToken;
        document.cookie = `access_token=${newAccessToken}; path=/`;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return privateApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default privateApi;
