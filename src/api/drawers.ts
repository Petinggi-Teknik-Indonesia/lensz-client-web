// api/users.js
import type { Drawers, DrawersInput } from "@/types/drawers";
import axios from "./axios";

export const getAllDrawers = async (): Promise<Drawers[]> => {
  const resp  = await axios.get<Drawers[]>("/api/drawers/");
  console.log(resp.data)
  return resp.data;
};

export const getDrawer = async (id: number): Promise<Drawers> => {
  const { data } = await axios.get<Drawers>(`/api/drawers/${id}/`);
  return data;
};

export async function addDrawers(newDrawers: DrawersInput) {
  const { data } = await axios.post(`/api/drawers/`, newDrawers);
  return data;
}

