import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Role, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8089/codingFactory/auth'; // URL correcte du backend

  constructor(private http: HttpClient) {}

  // Inscription d'un utilisateur
  register(user: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, user).pipe(
      catchError(error => {
        console.error("Erreur lors de l'inscription :", error);
        return throwError(() => new Error("Erreur lors de l'inscription"));
      })
    );
  }

  // Connexion d'un utilisateur
  login(user: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, user).pipe(
      catchError(error => {
        console.error("Erreur de connexion :", error);
        return throwError(() => new Error("Email ou mot de passe incorrect"));
      })
    );
  }

  // Sauvegarde du token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupère le token du localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Vérifie si l'utilisateur est authentifié en fonction du token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Déconnexion de l'utilisateur en supprimant le token
  logout(): void {
    localStorage.removeItem('token');
  }

  // Vérifie si l'utilisateur est connecté en retour d'une valeur booléenne
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Récupère les informations de l'utilisateur authentifié
  getUserInfo(): Observable<User> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error("Aucun token trouvé"));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<User>(`${this.baseUrl}/me`, { headers }).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération des infos utilisateur :", error);
        return throwError(() => new Error("Impossible de récupérer l'utilisateur"));
      })
    );
  }

  // Récupère le rôle de l'utilisateur en l'extrayant depuis ses informations
  getUserRole(): Observable<Role> {
    return new Observable(observer => {
      this.getUserInfo().subscribe({
        next: (user) => observer.next(user.role), // Récupère le rôle depuis l'utilisateur
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }

  // Renvoie un observable pour savoir si l'utilisateur est connecté ou non
  isLoggedInObservable(): Observable<boolean> {
    return of(this.isAuthenticated()); // Renvoie true si connecté, false sinon
  }
}
