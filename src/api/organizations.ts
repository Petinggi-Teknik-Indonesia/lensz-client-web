import instance from "./axios";

export type Organization = {
  ID: number;
  name: string;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  const res = await instance.get("/api/organizations");
  return res.data;
};
