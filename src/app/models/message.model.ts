import { User } from "./User";

export class Message {
    message_id!: number;
    description!: string;
    image?: string; // Optionnel
    numberOfLikes!: number;
    messageDate!: Date;
    userId!: number; // Ajoutez ce champ
    likes: number; // Nombre de likes pour ce message
    dislikes: number; // Nombre de dislikes pour ce message
    isLikedByCurrentUser: boolean; // Nouvelle propriété
    isDislikedByCurrentUser: boolean; // Nouvelle propriété
    userName?: string; // Ajoutez cette ligne
    anonymous!: boolean; // Indique si le message est anonyme
    latitude?: number;
    longitude?: number;
    audioUrl?: string; // Ajouter ce champ
    user?: User;


}