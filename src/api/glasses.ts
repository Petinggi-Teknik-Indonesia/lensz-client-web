// api/users.js
import type { Glasses, GlassesHistory, GlassesInput } from "@/types/glasses";
import axios from "./axios";

export const getAllGlasses = async (): Promise<Glasses[]> => {
  const resp  = await axios.get<Glasses[]>("/api/glasses/");
  console.log(resp.data)
  return resp.data;
};

export const getGlasses = async (id: number): Promise<Glasses> => {
  const { data } = await axios.get<Glasses>(`/api/glasses/${id}`);
  return data;
};


export async function addGlasses(newGlasses: GlassesInput) {
  const { data } = await axios.post(`/api/glasses/`, newGlasses);
  return data;
};

export async function getGlassesByDrawer(drawerName: string) {
  const allGlasses = await getAllGlasses();
  return allGlasses.filter(
    (g: any) => g.drawer?.toLowerCase() === drawerName.toLowerCase()
  );
}
export async function deleteGlasses(id:number){
  const {data, status} = await axios.delete(`/api/glasses/${id}`);
  console.log(status)
  return data;
}

export async function updateGlasses(id: number, updatedGlasses: GlassesInput) {
  // transform nested structure to flat IDs for backend
  const payload = {
    rfid: updatedGlasses.rfid,
    name: updatedGlasses.name,
    type: updatedGlasses.type,
    color: updatedGlasses.color,
    status: updatedGlasses.status,
    description: updatedGlasses.description ?? "",
    drawerId: updatedGlasses.drawer?.id,
    companyId: updatedGlasses.company?.id,
    brandId: updatedGlasses.brand?.id,
  };
  console.log("Payload")
  console.log(payload)

  const { data } = await axios.put(`/api/glasses/${id}`, payload);
  return data;

}

export async function historyGlasses(id: number){
  const { data } = await axios.get<GlassesHistory>(`/api/glasses/${id}/history`);
  return data;
}