import privateApi from "./private";

export const getUnverifiedUsers = async () => {
  const { data } = await privateApi.get("/api/users/admin/unverified");
  return data;
};

export const getVerifiedUsers = async () => {
  const { data } = await privateApi.get("/api/users/admin/verified");
  return data;
};

export const verifyUser = async (email: string) => {
  const { data } = await privateApi.post(
    `/api/users/admin/verify/${email}`
  );
  return data;
};

export const rejectUser = async (email: string) => {
  const { data } = await privateApi.post(
    `/api/users/admin/reject/${email}`
  );
  return data;
};
