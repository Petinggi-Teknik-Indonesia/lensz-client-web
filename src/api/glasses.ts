// api/users.js
import type { Glasses, GlassesInput } from "@/types/glasses";
import axios from "./axios";

export const getAllGlasses = async (): Promise<Glasses[]> => {
  const resp  = await axios.get<Glasses[]>("/api/glasses/");
  console.log(resp.data)
  return resp.data;
};

export const getGlasses = async (id: number): Promise<Glasses> => {
  const { data } = await axios.get<Glasses>(`/api/glasses/${id}`);
  console.log(data)
  return data;
};


export async function addGlasses(newGlasses: GlassesInput) {
  const { data } = await axios.post(`/api/glasses/`, newGlasses);
  return data;
}

