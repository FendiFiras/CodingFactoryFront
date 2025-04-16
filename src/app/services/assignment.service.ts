import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Assignment } from '../models/Assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = 'http://localhost:8089/pidev/assignments'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all assignments
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.apiUrl);
  }
  createAssignment(userId: number, offerId: number, assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.apiUrl}/create?userId=${userId}&offerId=${offerId}`, assignment);
  }
 /* getAssignmentsByOfferId(offerId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-offer/${offerId}`);
  }*/

  // Fetch a single assignment by ID
  getAssignmentById(id: number): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`);
  }
 /* getAssignmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }*/
  // Create an assignment

  // Update an assignment
  updateAssignment(id: number, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/update-affectation/${id}`, assignment);
  }
  getAssignmentsByUserId(userId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-user/${userId}`);
  }
  getAssignmentsByOfferId(offerId: number): Observable<Assignment[]> {
    // Verify the endpoint matches your backend API
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-offer/${offerId}`)
      .pipe(
        catchError((error) => {
          console.error('Detailed error:', error);
          if (error.status === 404) {
            console.error('Endpoint not found. Verify:', `${this.apiUrl}/by-offer/${offerId}`);
          }
          return throwError(() => new Error('Failed to fetch assignments. Check network tab for details.'));
        })
      );
  }
  // Delete an assignment
  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detete-affectation/${id}`);
  }
  getAssignmentByUserId(userId: number): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/by-user/${userId}`);
  }
  getUserNameByAssignmentId(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}/user-name`, { responseType: 'text' });
  }
  
  getOfferTitleByAssignmentId(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}/offer-title`, { responseType: 'text' });
  }
}