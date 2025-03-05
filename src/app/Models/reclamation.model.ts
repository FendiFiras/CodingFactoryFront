import { Material } from "./material";
import { Type } from "./type";
import { TypeStatut } from "./type-statut";

export interface Reclamation {
  idReclamation?: number;
  title: string;
  description: string;
  creationDate: Date;
  type: Type;
  status?: TypeStatut;
  urgencyLevel: number;
  materials: Material[];
  idUser: number; // Static for now
}