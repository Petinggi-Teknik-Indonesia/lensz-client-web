// src/api/scanners.ts
import privateApi from "@/api/private";
import type { Scanner } from "@/types/scanners";

/* =========================
   GET ALL SCANNERS
   ========================= */
export const getAllScanners = async (): Promise<Scanner[]> => {
  const { data } = await privateApi.get("/api/scanners");
  return data;
};

/* =========================
   CREATE SCANNER
   ========================= */
export const createScanner = async (payload: {
  deviceName: string;
}): Promise<Scanner> => {
  const { data } = await privateApi.post("/api/scanners", payload);
  return data;
};

/* =========================
   UPDATE SCANNER
   ========================= */
export const updateScanner = async (
  id: number,
  payload: { deviceName: string }
): Promise<Scanner> => {
  const { data } = await privateApi.put(
    `/api/scanners/${id}`,
    payload
  );
  return data;
};

/* =========================
   DELETE SCANNER
   ========================= */
export const deleteScanner = async (id: number): Promise<void> => {
  await privateApi.delete(`/api/scanners/${id}`);
};
