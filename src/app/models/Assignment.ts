export class Assignment {
  idAffectation?: number; // Optional because it's auto-generated
  status: string;
  startDate: Date;
  endDate: Date | null;
  evaluation: any | null; // Use the correct type for evaluation
}