import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { tap } from 'rxjs/operators'; // Importez tap depuis rxjs/operators

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
    return this.http.get(`${this.apiUrl}/discussion/${discussionId}`).pipe(
      tap(data => console.log('Données reçues de l\'API :', data)) // Utilisez tap pour inspecter les données
    );
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

  // Modifier un message existant
  updateMessage(messageId: number, description: string): Observable<Message> {
    const url = `${this.apiUrl}/update/${messageId}`;
    const body = {
      description: description,
    };
    return this.http.put<Message>(url, body);
  }


  updateMessageWithImage(messageId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${messageId}/update-with-image`, formData);
}
  // Supprimer un message
  deleteMessage(messageId: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${messageId}`;
    return this.http.delete<void>(url);
  }

    // Méthode pour ajouter un message avec une image
    addMessageWithImage(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/add-with-image`, formData);
    }
}