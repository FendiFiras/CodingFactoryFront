
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
    addForum(userId: number, formData: FormData): Observable<Forum> {
      const url = `${this.apiUrl}/AddForum/${userId}`;
      return this.http.post<Forum>(url, formData); 
    }
    
    
  }
  