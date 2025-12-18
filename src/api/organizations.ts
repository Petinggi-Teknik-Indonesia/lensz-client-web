import instance from "./axios";

export const getOrganizations = async () => {
  const { data } = await instance.get("/api/organizations");
  return data;
};
