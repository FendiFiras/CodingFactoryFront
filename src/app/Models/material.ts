import { Supplier } from "./supplier";

export interface Material {
    idMaterial?: number;
    label: string;
    quantity: number;
    supplier?: Supplier;
  }