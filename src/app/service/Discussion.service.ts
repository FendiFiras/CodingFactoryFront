import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Discussion {
  id?: number;
  title: string;
  description: string;
  numberOfLikes: number;
  publicationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private apiUrl = 'http://localhost:8089/api/discussion';  // URL de l'API pour les discussions

  constructor(private http: HttpClient) { }

  // Récupérer toutes les discussions
  getAllDiscussions(): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`${this.apiUrl}/GetAllDiscussions`);
  }
  

  // Récupérer les discussions d'un forum spécifique
  getDiscussionsByForum(forumId: number): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`http://localhost:8089/forum/${forumId}`);
  }

 // Récupérer une discussion par son ID
getDiscussionById(forumId: number, id: number): Observable<Discussion> {
  return this.http.get<Discussion>(`http://localhost:8089/forum/${forumId}/GetDiscussionBy/${id}`);
}


  // Ajouter une discussion à un forum
  addDiscussionToForum(discussion: Discussion, userId: number, forumId: number): Observable<Discussion> {
    return this.http.post<Discussion>(`http://localhost:8089/add/${userId}/${forumId}`, discussion);
  }
  
  // Mettre à jour une discussion
  updateDiscussion(discussion: Discussion): Observable<Discussion> {
    return this.http.put<Discussion>(`${this.apiUrl}/UpdateDiscussion/${discussion.id}`, discussion);
  }

  // Supprimer une discussion
  deleteDiscussion(discussionId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8089/deleteDiscussion/${discussionId}`);
  }
}