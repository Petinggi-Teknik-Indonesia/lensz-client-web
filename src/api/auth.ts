import publicApi from "./axios";
import privateApi from "./private";
import { setAccessToken } from "@/lib/token";

// register
export const register = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  organizationId: number;
}) => {
  const { data } = await publicApi.post("/api/users/register", payload);
  return data;
};

// login
export const login = async (payload: { email: string; password: string }) => {
  const { data } = await publicApi.post("/api/users/login", payload);

  // accessToken disimpan di frontend
  setAccessToken(data.accessToken);

  // refreshToken otomatis di cookie (httpOnly)
  return data;
};

// GET LOGGED IN USER
export const getMe = async () => {
  const { data } = await privateApi.get("/api/auth/me");
  return data;
};
