
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Forum {
  id?: number;
  title: string;
  description: string;
  image?: string;
  creationDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private apiUrl = 'http://localhost:8089/api/forum';  // Changez cette URL pour correspondre à votre backend

  constructor(private http: HttpClient) { }

  // Récupérer tous les forums
  getAllForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(`${this.apiUrl}/GetAllForums`);
  }
  

  // Ajouter un forum avec FormData
  addForum(formData: FormData): Observable<Forum> {
    const userId = formData.get('userId');  // Récupérer userId à partir du FormData
    return this.http.post<Forum>(`${this.apiUrl}/AddForum/${userId}`, formData);
  }
  
// Modifier un forum
updateForum(forumId: number, formData: FormData): Observable<Forum> {
return this.http.put<Forum>(`${this.apiUrl}/UpdateForum/${forumId}`, formData)
.pipe(
  tap((response) => console.log('Réponse du serveur :', response)) // Afficher la réponse
);
}

// Supprimer un forum
deleteForum(forumId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete/${forumId}`, {
    observe: 'response', // Observer la réponse complète
  }).pipe(
    tap((response) => {
      if (response.status === 200) {
        console.log('Forum supprimé avec succès');
      }
    }),
    map(() => null) // Ignorer la réponse et retourner `void`
  );
}
  
}
