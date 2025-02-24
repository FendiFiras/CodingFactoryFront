import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Forum } from '../models/forum';

@Injectable({
  providedIn: 'root', // Provided in the root injector
})
export class ForumService {
   private apiUrl = 'http://localhost:8089/api/forum'; // Correction du port
  ; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Get all forums
  getAllForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(`${this.apiUrl}/GetAllForums`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching forums:', error);
        return throwError(() => new Error('Failed to fetch forums.'));
      })
    );
  
  }
  

  // Get a single forum by ID
  getForumById(id: number): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiUrl}/GetForumBy/${id}`);
  }

  addForum(userId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/AddForum/${userId}`;
    return this.http.post(url, formData);
}

  

  // Update a forum
  updateForum(forum: Forum): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/UpdateForum`, forum);
  }

  // Delete a forum
  deleteForum(forumId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${forumId}`, {
      responseType: 'text' as 'json', // Handle text response
    });
  }
}