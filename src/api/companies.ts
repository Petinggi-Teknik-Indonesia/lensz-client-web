// api/users.js
import type { Companies, CompaniesInput } from "@/types/companies";
import axios from "./axios";

export const getAllCompanies = async (): Promise<Companies[]> => {
  const resp  = await axios.get<Companies[]>("/api/companies");
  console.log(resp.data)
  return resp.data;
};

export const getCompany = async (id: number): Promise<Companies> => {
  const { data } = await axios.get<Companies>(`/api/companies/${id}`);
  return data;
};

export async function addCompany(newCompanies: CompaniesInput) {
  const { data } = await axios.post(`/api/companies`, newCompanies);
  return data;
}

export async function deleteCompany(id: number) {
  const { data, status } = await axios.delete(`/api/companies/${id}`);
  console.log(status);
  return data;
}

export async function updateCompany(id: number, updatedCompany: CompaniesInput) {
  // Transform payload if needed, here it's simple
  const payload = {
    name: updatedCompany.name,
  };
  console.log("Payload for updateCompany:", payload);

  const { data } = await axios.put(`/api/companies/${id}`, payload);
  return data;
}