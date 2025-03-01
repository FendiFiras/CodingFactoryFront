import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8089/messages'; // Mettez à jour l'URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer tous les messages d'une discussion spécifique
  getMessagesForDiscussion(discussionId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/discussion/${discussionId}`);
  }

  getMessagesByDiscussion(discussionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/discussion/${discussionId}`);
  }
  
  // Ajouter un message à une discussion
  addMessage(userId: number, discussionId: number, description: string): Observable<Message> {
    const url = `${this.apiUrl}/add?userId=${userId}&discussionId=${discussionId}`;
    const body = {
      message_id: 0,
      description: description,
      image: "string", // Remplacez par une valeur appropriée ou laissez vide si non utilisé
      messageDate: new Date().toISOString()
    };
    console.log('Envoi de la requête POST avec le corps :', body); // Log du corps de la requête
    return this.http.post<Message>(url, body);
  }
}