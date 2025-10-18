// api/users.js
import type { Brands, BrandsInput } from "@/types/brands";
import axios from "./axios";
export const getAllBrands = async (): Promise<Brands[]> => {
  const resp  = await axios.get<Brands[]>("/api/brands/");
  console.log(resp.data)
  return resp.data;
};

export const getBrand = async (id: number): Promise<Brands> => {
  const { data } = await axios.get<Brands>(`/api/brands/${id}/`);
  return data;
};

export async function addBrands(newBrands: BrandsInput) {
  const { data } = await axios.post(`/api/brands/`, newBrands);
  return data;
}

