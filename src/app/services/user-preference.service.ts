

 
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { catchError, Observable, throwError } from 'rxjs';
  import { UserPreference } from '../models/user-preference';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserPreferenceService {
    private apiUrl = 'http://localhost:8089/codingFactory/userPreferences';
  
    constructor(private http: HttpClient) {}
  
    addUserPreference(userPreference: UserPreference, userId: number | undefined): Observable<UserPreference> {
      if (!userId) {
        console.error('Erreur: userId est undefined, impossible d\'ajouter la préférence.');
        return throwError(() => new Error('User ID is undefined'));
      }
  
      return this.http.post<UserPreference>(`${this.apiUrl}/${userId}`, userPreference).pipe(
        catchError((error) => {
          console.error('Erreur lors de l\'ajout des préférences utilisateur:', error);
          return throwError(() => error);
        })
      );
    } getAllUserPreferences(): Observable<UserPreference[]> {
      return this.http.get<UserPreference[]>(this.apiUrl);
    }
  
  
    modifyUserPreference(userPreference: UserPreference): Observable<UserPreference> {
      if (!userPreference.idPreference) {
        console.error('Erreur: idPreference est undefined, impossible de modifier la préférence.');
        return throwError(() => new Error('Preference ID is undefined'));
      }
    
      return this.http.put<UserPreference>(
        `${this.apiUrl}/${userPreference.idPreference}`, // Vérifie ici l'URL pour correspondre à la route du backend
        userPreference
      );
    }
    
    
  
    getUserPreference(idUser: number): Observable<UserPreference> {
      return this.http.get<UserPreference>(`${this.apiUrl}/${idUser}`);
    }
  }
  
