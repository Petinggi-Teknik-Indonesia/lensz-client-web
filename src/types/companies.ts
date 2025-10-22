export type Companies = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type CompaniesInput = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};