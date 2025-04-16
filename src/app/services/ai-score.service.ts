import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiScoreService {

  private apiUrl = 'http://localhost:8089/pidev/score/calculate'; // Adjust with your backend API URL

  constructor(private http: HttpClient) {}

  // Function to send the file and required skills to the Spring Boot backend
  calculateMatchScore(file: File, requiredSkills: string): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('requiredSkills', requiredSkills);

    return this.http.post<number>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error occurred:', error);
    // return an observable with a user-facing error message or default fallback
    return throwError(() => new Error('Something went wrong while calculating AI score.'));
  }
}
