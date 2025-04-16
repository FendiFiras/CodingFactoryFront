import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discussion } from '../models/discussion1'; // Import the correct interface

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  private apiUrl = 'http://localhost:8085/api/discussion'; // Base URL for discussions

  constructor(private http: HttpClient) { }

  // Get all discussions
  getAllDiscussions(): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`${this.apiUrl}/GetAllDiscussions`);
  }

  // Get discussions by forum ID
  getDiscussionsByForum(forumId: number): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`http://localhost:8085/forum/${forumId}`);
  }

  // Get a discussion by its ID
  getDiscussionById(forumId: number, discussionId: number): Observable<Discussion> {
    return this.http.get<Discussion>(`http://localhost:8085/forum/${forumId}/GetDiscussionBy/${discussionId}`);
  }

  // Add a discussion to a forum
  addDiscussionToForum(discussion: Discussion, userId: number, forumId: number): Observable<Discussion> {
    return this.http.post<Discussion>(`http://localhost:8085/add/${userId}/${forumId}`, discussion);
  }

   // Update a discussion 
  updateDiscussion(discussionId: number, updatedDiscussion: any): Observable<any> {
    return this.http.put(`http://localhost:8085/UpdateDiscussion/${discussionId}`, updatedDiscussion);
  }

  // Delete a discussion
  deleteDiscussion(discussionId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8085/deleteDiscussion/${discussionId}`);
  }

}