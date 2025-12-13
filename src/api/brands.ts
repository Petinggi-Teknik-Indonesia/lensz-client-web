// api/brands.ts
import type { Brands, BrandsInput } from "@/types/brands";
import axios from "./axios";

export const getAllBrands = async (): Promise<Brands[]> => {
  const resp = await axios.get<Brands[]>("/api/brands");
  console.log(resp.data);
  return resp.data;
};

export async function deleteBrand(id: number) {
  const { data, status } = await axios.delete(`/api/brands/${id}`);
  console.log(status);
  return data;
}

export async function updateBrand(id: number, updatedBrand: BrandsInput) {
  // Transform payload if needed, here it's simple
  const payload = {
    name: updatedBrand.name,
  };

  console.log("Payload for updateBrands:", payload);

  const { data } = await axios.put(`/api/brands/${id}`, payload);
  return data;
}
