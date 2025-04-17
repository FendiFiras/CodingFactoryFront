export interface Message {
    id?: number;
    sender: string;
    content: string;
    timestamp?: string;
    reclamation: {
      idReclamation: number; // ✅ ce champ doit exister pour le backend
    };
  }
  