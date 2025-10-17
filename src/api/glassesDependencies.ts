import type { Brands } from "@/types/brands";
import axios from "./axios";
import type { Companies } from "@/types/companies";
import type { Drawers } from "@/types/drawers";

export function formatDate(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};



// 🧩 Dependencies
export const getAllBrands = async (): Promise<Brands[]> => {
  const { data } = await axios.get("/api/brands/");
  return data;
};

export const getAllCompanies = async (): Promise<Companies[]> => {
  const { data } = await axios.get("/api/companies/");
  return data;
};
export const getAllDrawers = async (): Promise<Drawers[]> => {
  const { data } = await axios.get("/api/drawers/");
  return data;
};

// Create new dependencies
export const addBrand = async (body: { name: string }) => {
  const { data } = await axios.post("/api/brands/", body);
  return data;
};
export const addCompany = async (body: { name: string }) => {
  const { data } = await axios.post("/companies/", body);
  return data;
};
export const addDrawer = async (body: { name: string }) => {
  const { data } = await axios.post("/drawers/", body);
  return data;
};

