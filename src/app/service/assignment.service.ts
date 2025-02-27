import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  getAssignmentsByOfferId(offerId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-offer/${offerId}`);
  }

  // Fetch a single assignment by ID
  getAssignmentById(id: number): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`);
  }

  // Create an assignment

  // Update an assignment
  updateAssignment(id: number, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/update-affectation/${id}`, assignment);
  }
  getAssignmentsByUserId(userId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  // Delete an assignment
  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detete-affectation/${id}`);
  }
  getAssignmentByUserId(userId: number): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/by-user/${userId}`);
  }
  
}