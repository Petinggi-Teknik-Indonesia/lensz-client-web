export type User = {
  id: number;
  name: string;
  email: string;
  verifiedStatus: boolean;
  role?: {
    ID: number;
    name: string;
  };
  organization?: {
    ID: number;
    name: string;
  };
  createdAt?: string;
};
