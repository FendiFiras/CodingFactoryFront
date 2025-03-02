export class Message {
    message_id!: number;
    description!: string;
    image?: string; // Optionnel
    numberOfLikes!: number;
    messageDate!: Date;
    userId!: number; // Ajoutez ce champ

}