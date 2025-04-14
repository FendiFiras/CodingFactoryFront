import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

// Ajouter un message à une discussion avec ou sans anonymat
addMessage(userId: number, discussionId: number, description: string, anonymous: boolean = false): Observable<Message> {
  const url = `${this.apiUrl}/add`;
  const params = new HttpParams()
    .set('userId', userId.toString())
    .set('discussionId', discussionId.toString())
    .set('description', description)
    .set('anonymous', anonymous.toString());

  return this.http.post<Message>(url, null, { params });
}
   // Ajouter un message avec une image et l'option d'anonymat
   addMessageWithImage(formData: FormData, anonymous: boolean = false): Observable<Message> {
    const url = `${this.apiUrl}/add-with-image`;
    formData.append('anonymous', anonymous.toString());
    return this.http.post<Message>(url, formData);
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

   /* // Méthode pour ajouter un message avec une image
    addMessageWithImage(formData: FormData): Observable<Message> {
      return this.http.post<Message>(`${this.apiUrl}/add-with-image`, formData);
    }
      */

    addMessageWithLocation(userId: number, discussionId: number, description: string, latitude: number | null, longitude: number | null, anonymous: boolean = false): Observable<Message> {
      const url = `${this.apiUrl}/add-with-location`;
      let params = new HttpParams()
        .set('userId', userId.toString())
        .set('discussionId', discussionId.toString())
        .set('description', description)
        .set('anonymous', anonymous.toString());
    
      // Ajouter latitude et longitude uniquement si elles ne sont pas null
      if (latitude !== null) {
        params = params.set('latitude', latitude.toString());
      }
      if (longitude !== null) {
        params = params.set('longitude', longitude.toString());
      }
    
      console.log('Paramètres envoyés au backend :', params.toString()); // Log des paramètres
    
      return this.http.post<Message>(url, null, { params });
    }

     // Ajouter un message vocal
     addAudioMessage(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/audio`, formData, { responseType: 'text' });
    }
} 