
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Application } from '../models/Application';
import { Assignment } from '../models/Assignment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8089/pidev/applications'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}
/*
  applyForOffer(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/apply`, application);
  }*/

    applyForOffer(formData: FormData, userId: number): Observable<any> {
      return this.http
        .post(`${this.apiUrl}/apply/${userId}`, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // Handle errors and rethrow them for the component to handle
            let errorMessage = 'An error occurred while applying for the offer.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message; // Use the error message from the backend
            } else if (error.status === 400) {
              errorMessage = 'Invalid request. Please check your input.';
            } else if (error.status === 403) {
              errorMessage = 'You do not have permission to perform this action.';
            } else if (error.status === 404) {
              errorMessage = 'The offer or user was not found.';
            }
            return throwError(() => new Error(errorMessage));
          })
        );
    }
  
  getApplicationsByOfferId(offerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applicationsforCR/${offerId}`);
  }
  // Upload CV file
  uploadCv(file: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/upload-cv`, file);
  }
   // Fetch all applications
   getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  // Fetch a single application by ID
  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  // Update an application
  updateApplication(id: number, application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/updateapp/${id}`, application);
  }

  // Delete an application
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteapp/${id}`);
  }
  getUserIdByApplicationId(applicationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${applicationId}`);
  }


}