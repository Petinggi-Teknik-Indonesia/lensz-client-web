import axios from "./axios";

export function formatDate(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Create new dependencies
export const addBrand = async (body: { name: string }) => {
  const { data } = await axios.post("/api/brands", body);
  return data;
};
export const addCompany = async (body: { name: string }) => {
  const { data } = await axios.post("/api/companies", body);
  return data;
};
export const addDrawer = async (body: { name: string }) => {
  const { data } = await axios.post("/api/drawers", body);
  return data;
};
