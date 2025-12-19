import privateApi from "@/api/private";
import type { ScannerInput, UpdateScannerInput } from "@/types/scanners";

export const getAllScanners = async () => {
  const { data } = await privateApi.get("/api/scanners");
  return data;
};

export const createScanner = async (payload: ScannerInput) => {
  const { data } = await privateApi.post("/api/scanners", payload);
  return data;
};

export const updateScanner = async (
  id: number,
  payload: UpdateScannerInput
) => {
  const { data } = await privateApi.put(
    `/api/scanners/${id}`,
    payload
  );
  return data;
};

export const deleteScanner = async (id: number) => {
  const { data } = await privateApi.delete(`/api/scanners/${id}`);
  return data;
};
