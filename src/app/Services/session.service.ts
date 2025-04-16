import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model'; // Importer le modèle

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8081/pidev/Session'; // URL de ton API pour les sessions

  constructor(private http: HttpClient) {}

  // Récupérer toutes les sessions
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/getAllSessions`);
  }

  createSession(session: Session, courseId: number): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/add_Session/${courseId}`, session);
  }
  
  
  
  

  // Mettre à jour une session existante
  updateSession(session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/update_Session`, session);
  }

  // Supprimer une session par son ID
  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteSession/${id}`);
  }

  // Récupérer une session par son ID
  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/getSession/${id}`);
  }


  // session.service.ts
getSessionsByTraining(trainingId: number): Observable<Session[]> {
  return this.http.get<Session[]>(`${this.apiUrl}/getSessionsByTraining/${trainingId}`);
}


  // session.service.ts
  getLocationName(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url);
  }


}
