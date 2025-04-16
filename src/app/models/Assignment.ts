import { Evaluation } from "./Evaluation";

export class Assignment {
  idAffectation?: number; // Optional because it's auto-generated
  status: string;
  startDate: Date;
  endDate: Date | null;

  userName?: string;    // we'll populate this
  offerTitle?: string;  // we'll populate this
  
  evaluation?: {
    idEvaluation: number;
    score: number;
    comment: string;
    evaluationPdf?: string;
    // ... other evaluation properties
  };
}

