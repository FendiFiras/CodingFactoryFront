export class Training {
    trainingId: number;
    trainingName: string;
    startDate: Date;
    endDate: Date;
    price: number;
    trainingType: TrainingType;  // Utilisation de l'Enum
  }
  export enum TrainingType {
    ONLINE = 'ONLINE',
    ON_SITE = 'ON_SITE'
  }
