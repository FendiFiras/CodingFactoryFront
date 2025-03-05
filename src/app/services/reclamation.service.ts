import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../Models/reclamation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private readonly API_URL = 'http://localhost:8082/reclamations';

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

  addReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.API_URL, reclamation);
  }

  updateReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(this.API_URL, reclamation);
  }

  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
