export interface Discussion {
    id?: number; // Optionnel car il peut ne pas être présent lors de la création
    title: string;
    description: string;
    numberOfLikes: number;
    publicationDate: string; // Utilisez `string` pour correspondre au format ISO de la date
  }