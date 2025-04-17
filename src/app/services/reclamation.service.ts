import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../models/reclamation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private readonly API_URL = 'http://localhost:8086/reclamations';

  constructor(private http: HttpClient) { }

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.API_URL);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.API_URL}/${id}`);
  }

  getReclamationsByUser(userId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.API_URL}?userId=${userId}`);
  }

  // addReclamation(reclamation: Reclamation): Observable<Reclamation> {
  //   return this.http.post<Reclamation>(this.API_URL, reclamation, {
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json'
  //       }
  //   });
  // }

  addReclamation(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}`, formData);
  }  

  treatReclamation(id: number, quantity: number): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.API_URL}/treat/${id}/${quantity}`, {});
  }  

  updateReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(this.API_URL, reclamation);
  }

  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/file/${id}`, {
      responseType: 'blob'
    });
  }  

  getMaterialStats(): Observable<{ label: string, totalQuantity: number }[]> {
    return this.http.get<{ label: string, totalQuantity: number }[]>(`${this.API_URL}/material-stats`);
  }
}
