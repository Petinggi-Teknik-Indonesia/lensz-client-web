import instance from "./axios";
import { getCookie } from "@/lib/cookie";

export const register = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  organizationId: number;
}) => {
  const { data } = await instance.post("/api/users/register", payload);
  return data;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await instance.post("/api/users/login", {
    email,
    password,
  });

  // 🔴 PENTING: backend HARUS kirim ini
  const { accessToken, refreshToken } = data;

  if (!accessToken || !refreshToken) {
    throw new Error("Token not returned from backend");
  }

  document.cookie = `access_token=${accessToken}; path=/`;
  document.cookie = `refresh_token=${refreshToken}; path=/`;

  return data;
};

export const getMe = async () => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token");
  }

  const res = await fetch("http://localhost:8080/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
};

export const refreshAccessToken = async () => {
  const refreshToken = getCookie("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch("/api/users/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Refresh token invalid");
  }

  const data = await res.json();

  document.cookie = `access_token=${data.accessToken}; path=/`;

  return data.accessToken;
};

