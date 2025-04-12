

 
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
  import { UserPreference } from '../models/user-preference';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserPreferenceService {
    private apiUrl = 'http://localhost:8089/codingFactory/userPreferences';
    private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
    theme$ = this.themeSubject.asObservable(); // Observable pour écouter les changements de thème
  
    constructor(private http: HttpClient) {}
  
    // 🔹 Ajout d'une préférence utilisateur
    addUserPreference(userPreference: UserPreference, userId: number | undefined): Observable<UserPreference> {
      if (!userId) {
        console.error('Erreur: userId est undefined.');
        return throwError(() => new Error('User ID is undefined'));
      }
  
      if (userPreference.notificationEnabled === undefined) {
        userPreference.notificationEnabled = false; // Valeur par défaut
      }
  
      return this.http.post<UserPreference>(`${this.apiUrl}/${userId}`, userPreference).pipe(
        catchError(this.handleError)
      );
    }
  
    // 🔹 Récupérer toutes les préférences (pas forcément utile ici)
    getAllUserPreferences(): Observable<UserPreference[]> {
      return this.http.get<UserPreference[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
    // 🔹 Modifier une préférence utilisateur
    modifyUserPreference(userPreference: UserPreference): Observable<UserPreference> {
      if (!userPreference.idPreference) {
        console.error('Erreur: idPreference est undefined.');
        return throwError(() => new Error('Preference ID is undefined'));
      }
  
      return this.http.put<UserPreference>(`${this.apiUrl}/${userPreference.idPreference}`, userPreference).pipe(
        catchError(this.handleError)
      );
    }
  
    // 🔹 Récupérer les préférences d'un utilisateur
    getUserPreference(idUser: number): Observable<UserPreference> {
      return this.http.get<UserPreference>(`${this.apiUrl}/${idUser}`).pipe(
        catchError(this.handleError),
        tap(preference => {
          if (preference.theme) {
            this.setTheme(preference.theme);
          }
        })
      );
    }
    
  
    // 🔹 Méthode pour changer le thème localement
    setTheme(theme: string) {
      if (this.themeSubject.value !== theme) { 
        this.themeSubject.next(theme);
        localStorage.setItem('user-theme', theme);
      }
    }
    
  
    // 🔹 Récupérer le thème depuis localStorage
    private getStoredTheme(): string {
      return localStorage.getItem('user-theme') || 'light'; // Par défaut, mode clair
    }
  
    // 🔹 Gestion centralisée des erreurs
    private handleError(error: any) {
      console.error('Erreur API:', error);
      return throwError(() => error);
    }
    getThemeStats(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/stats/theme`).pipe(
        catchError(this.handleError)
      );
    }

  }