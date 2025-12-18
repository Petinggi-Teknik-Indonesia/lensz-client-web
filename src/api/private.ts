import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/lib/token";

const privateApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// attach access token
privateApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh token when expired
privateApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${"http://localhost:8080"}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return privateApi(originalRequest);
      } catch {
        clearAccessToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default privateApi;
