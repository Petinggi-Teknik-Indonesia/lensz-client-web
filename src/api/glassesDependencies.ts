import axios from "./axios";

// 🧩 Dependencies
export const getAllBrands = async () => {
  const { data } = await axios.get("/api/brands/");
  return data;
};
export const getAllCompanies = async () => {
  const { data } = await axios.get("/api/companies/");
  return data;
};
export const getAllDrawers = async () => {
  const { data } = await axios.get("/api/drawers/");
  return data;
};

// Create new dependencies
export const addBrand = async (body: { name: string }) => {
  const { data } = await axios.post("/api/brands/", body);
  return data;
};
export const addCompany = async (body: { name: string }) => {
  const { data } = await axios.post("/api/companies/", body);
  return data;
};
export const addDrawer = async (body: { name: string }) => {
  const { data } = await axios.post("/api/drawers/", body);
  return data;
};