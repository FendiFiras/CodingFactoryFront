import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Evaluation } from '../models/Evaluation';
import { filter, take } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8089/pidev/evaluations'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all evaluations
  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  // Fetch a single evaluation by ID
  getEvaluationById(id: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  // Create an evaluation
 /* createEvaluation(userId: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/create?userId=${userId}`, evaluation);
  }*/
   
    createEvaluation(assignmentId: number, evaluationData: any, pdfFile: File): Observable<any> {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId.toString());
      formData.append('evaluation', new Blob([JSON.stringify(evaluationData)], { type: 'application/json' }));
      formData.append('pdfFile', pdfFile, pdfFile.name);
    
      return this.http.post<any>(`${this.apiUrl}/create`, formData).pipe(
        catchError(this.handleError)
      );
    }
    
    
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
      return throwError(errorMessage);
    }
  
  // Update an evaluation
  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/updateevaluation/${id}`, evaluation);
  }

  // Delete an evaluation
  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/updateevaluation/${id}`);
  }
  getEvaluationPdf(evaluationId: number): Observable<Blob> {
    const url = `${this.apiUrl}/${evaluationId}/pdf`;
    return this.http.get(url, { responseType: 'blob' });
  }
}