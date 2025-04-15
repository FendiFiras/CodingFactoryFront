export class Training {
    trainingId: number;
    trainingName: string;
    startDate: Date;
    endDate: Date;
    price: number;
    type: string;  // ✅ Le même nom que dans l'objet reçu
  }
  export enum TrainingType {
    ONLINE = 'ONLINE',
    ON_SITE = 'ON_SITE'
  }
