// api/users.js
import type { Drawers, DrawersInput } from "@/types/drawers";
import axios from "./axios";

export const getAllDrawers = async (): Promise<Drawers[]> => {
  const resp = await axios.get<Drawers[]>("/api/drawers");
  console.log(resp.data);
  return resp.data;
};

export async function updateDrawers(id: number, updatedDrawer: DrawersInput) {
  // Transform payload if needed, here it's simple
  const payload = {
    name: updatedDrawer.name,
  };

  console.log("Payload for updateDrawer:", payload);

  const { data } = await axios.put(`/api/drawers/${id}`, payload);
  return data;
}

export async function deleteDrawer(id: number) {
  const { data, status } = await axios.delete(`/api/drawers/${id}`);
  console.log(status);
  return data;
}
