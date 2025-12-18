// api/brands.ts
import type { Brands, BrandsInput } from "@/types/brands";
import privateApi from "./private";

export const getAllBrands = async (): Promise<Brands[]> => {
  const resp = await privateApi.get<Brands[]>("/api/brands");
  console.log(resp.data);
  return resp.data;
};

export const getBrand = async (id: number): Promise<Brands> => {
  const { data } = await privateApi.get<Brands>(`/api/brands/${id}`);
  return data;
};

export async function addBrand(newBrand: BrandsInput) {
  const { data } = await privateApi.post(`/api/brands/`, newBrand);
  return data;
}

export async function deleteBrand(id: number) {
  const { data, status } = await privateApi.delete(`/api/brands/${id}`);
  console.log(status);
  return data;
}

export async function updateBrand(id: number, updatedBrand: BrandsInput) {
  // Transform payload if needed, here it's simple
  const payload = {
    name: updatedBrand.name,
  };

  console.log("Payload for updateBrands:", payload);

  const { data } = await privateApi.put(`/api/brands/${id}`, payload);
  return data;
}
