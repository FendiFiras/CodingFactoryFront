import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discussion } from '../models/discussion1'; // Import the correct interface

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  private apiUrl = 'http://localhost:8089/api/discussion'; // Base URL for discussions

  constructor(private http: HttpClient) { }

  // Get all discussions
  getAllDiscussions(): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`${this.apiUrl}/GetAllDiscussions`);
  }

  // Get discussions by forum ID
  getDiscussionsByForum(forumId: number): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`http://localhost:8089/forum/${forumId}`);
  }

  // Get a discussion by its ID
  getDiscussionById(forumId: number, id: number): Observable<Discussion> {
    return this.http.get<Discussion>(`http://localhost:8089/forum/${forumId}/GetDiscussionBy/${id}`);
  }

  // Add a discussion to a forum
  addDiscussionToForum(discussion: Discussion, userId: number, forumId: number): Observable<Discussion> {
    return this.http.post<Discussion>(`http://localhost:8089/add/${userId}/${forumId}`, discussion);
  }

  updateDiscussion(discussionId: number, updatedDiscussion: any): Observable<any> {
    const url = ('http://localhost:8089/UpdateDiscussion/${discussionId}');
    return this.http.put(url, updatedDiscussion);
  }
  // Delete a discussion
  deleteDiscussion(discussionId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8089/deleteDiscussion/${discussionId}`);
  }
}