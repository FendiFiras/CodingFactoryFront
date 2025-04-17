import { TypeStatut } from "./type-statut";
import { Material } from "./material";
import { Type } from "./type";


export interface Reclamation {
  idReclamation?: number;
  title: string;
  description: string;
  creationDate: Date;
  type: Type;
  status?: TypeStatut;
  urgencyLevel: number;
  materials: Material[];
  quantity: number;
  idUser: number;
}