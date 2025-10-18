export type Glasses = {
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
};

export type GlassesInput = {
  rfid: string;
  name: string;
  type: string;
  color: string;
  status: string;
  drawer?: { name?: string; id?: number };
  company?: { name?: string; id?: number };
  brand?: { name?: string; id?: number };
};