// api/users.js
import type { Companies, CompaniesInput } from "@/types/companies";
import axios from "./axios";

export const getAllCompanies = async (): Promise<Companies[]> => {
  const resp  = await axios.get<Companies[]>("/companies/");
  console.log(resp.data)
  return resp.data;
};

export const getCompany = async (id: number): Promise<Companies> => {
  const { data } = await axios.get<Companies>(`/companies/${id}/`);
  return data;
};

export async function addCompanies(newCompanies: CompaniesInput) {
  const { data } = await axios.post(`/companies/`, newCompanies);
  return data;
}

