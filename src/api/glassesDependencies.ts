import axios from "./axios";

// 🧩 Dependencies
export const getAllBrands = async () => {
  const { data } = await axios.get("/brands/");
  return data;
};
export const getAllCompanies = async () => {
  const { data } = await axios.get("/companies/");
  return data;
};
export const getAllDrawers = async () => {
  const { data } = await axios.get("/drawers/");
  return data;
};

// Create new dependencies
export const addBrand = async (body: { name: string }) => {
  const { data } = await axios.post("/brands/", body);
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