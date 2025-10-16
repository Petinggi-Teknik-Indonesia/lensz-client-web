export type Brands = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type BrandsInput = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};