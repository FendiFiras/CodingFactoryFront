
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  
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
  return this.http.put<Forum>(`${this.apiUrl}/UpdateForum/${forumId}`, formData);
}

// Supprimer un forum
deleteForum(forumId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/delete/${forumId}`);
}

    
    
  }
  