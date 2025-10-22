export type Glasses = {
  extraInfo: string;
  id: number;
  rfid: string;
  name: string;
  type: string;
  color: string;
  status: string;
  drawer: string;
  company: string;
  brand: string;
  description?: string;

  drawerId: number;
  brandId: number;
  companyId: number;
};

export type GlassesInput = {
  rfid: string;
  name: string;
  type: string;
  color: string;
  status: string;
  description: string;
  drawer?: { name?: string; id?: number };
  company?: { name?: string; id?: number };
  brand?: { name?: string; id?: number };
};

export type GlassesHistory = {
  id: number;
  statusChange: string;
  glassesId: number;
  userName: string;
  createdAt: string;
}