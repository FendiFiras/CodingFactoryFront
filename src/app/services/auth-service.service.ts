import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Role, User } from '../models/user';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8089/codingFactory/auth'; // URL correcte du backend
  apiUrl: string = `${this.baseUrl}`; // Correction: Enlevez la déclaration "any" pour "string" 

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  // Inscription d'un utilisateur
  register(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, formData);
  }
  
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email })
      .pipe(
        map(response => response.exists) // Extraire la valeur de 'exists'
      );
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, user); // Utilisation correcte de l'URL
  }

  // Mettre à jour l'image de l'utilisateur
  updateUserImage(userId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);  // Ajouter l'image au FormData
    return this.http.post<any>(`${this.apiUrl}/update/${userId}/image`, formData); // Utilisation de apiUrl
  }
  
  
  

  // Connexion d'un utilisateur

  
  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
      catchError(error => {
        console.error("Login error:", error);
  
        let errorMessage = 'An unknown error occurred. Please try again.';
  
        if (error.status === 403) {
          // Si l'utilisateur est banni
          if (error.error && error.error.message) {
            errorMessage = error.error.message; // Récupérer le message du backend
          } else {
            errorMessage = 'Your account is banned.';
          }
        } else if (error.status === 401) {
          // Email ou mot de passe incorrect
          errorMessage = 'Invalid email or password.';
        }
  
        return throwError(() => new Error(errorMessage));
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
 
  
  acceptUser(idUser: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/accept/${idUser}`, {}).pipe(
      tap((response: any) => {  // Utilisation de 'any' ici
        console.log('Réponse du serveur:', response);
        if (response && response.status === 'error') {
          throw new Error(response.message || 'Une erreur s\'est produite lors de l\'acceptation de l\'utilisateur.');
        }
      }),
      catchError(error => {
        console.error('Erreur lors de l\'acceptation de l\'utilisateur', error);
        return throwError(() => new Error(error.message || 'Une erreur s\'est produite lors de l\'acceptation de l\'utilisateur.'));
      })
    );
  }
  
  rejectUser(idUser: number, rejectionReason: string): Observable<any> {
    const url = `${this.baseUrl}/reject/${idUser}`;
    const params = new HttpParams().set('rejectionReason', rejectionReason); // Encoder correctement le paramètre
  
    return this.http.put(url, {}, { params }).pipe(
      tap((response: any) => {
        console.log('Réponse du serveur:', response);
        if (response && response.status === 'error') {
          throw new Error(response.message || 'Une erreur s\'est produite lors du refus de l\'utilisateur.');
        }
      }),
      catchError(error => {
        console.error('Erreur lors du refus de l\'utilisateur', error);
        return throwError(() => new Error(error.message || 'Une erreur s\'est produite lors du refus de l\'utilisateur.'));
      })
    );
  }
  
  
  sendEmail(userId: number, password: string): Observable<any> {
    const body = { password: password };
    return this.http.post(`${this.baseUrl}/send-email/${userId}`, body).pipe(
      map(() => console.log('Email envoyé avec succès')),
      catchError(error => {
        console.error('Erreur lors de l\'envoi de l\'email', error);
        return throwError(() => new Error('Échec de l\'envoi de l\'email.'));
      })
    );
  }
  
  private generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  // Mettre à jour le CV de l'utilisateur
  updateUserCV(userId: number, cvFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('cv', cvFile); // Ajouter le fichier CV au FormData
  
    return this.http.put<any>(`${this.baseUrl}/update/${userId}/cv`, formData);
  }
  
// Télécharger le CV d'un utilisateur
getUserCV(cvFileName: string): Observable<Blob> {
  const token = this.getToken();
  if (!token) return throwError(() => new Error("Aucun token trouvé"));

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get(`${this.baseUrl}/cv/${cvFileName}`, {
    headers,
    responseType: 'blob'  // Permet de récupérer un fichier
  }).pipe(
    catchError(error => {
      console.error("Erreur lors de la récupération du CV :", error);
      return throwError(() => new Error("Impossible de récupérer le CV"));
    })
  );
}
verifyOtp(email: string, otp: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/verify-otp`, { email, otp }).pipe(
    catchError(error => {
      console.error("Erreur lors de la vérification de l'OTP :", error);
      return throwError(() => new Error("Erreur lors de la vérification de l'OTP"));
    })
  );
}

loginAndVerifyOTP(user: any, otp: string): Observable<{ token: string }> {
  return this.login(user).pipe(
    switchMap(() => {
      // Une fois que l'utilisateur est connecté, demande à l'utilisateur de saisir l'OTP
      return this.verifyOtp(user.email, otp);
    }),
    catchError(error => {
      console.error('Erreur de connexion ou OTP', error);
      return throwError(() => new Error('Échec de la connexion ou OTP invalide'));
    })
  );
}

googleLogin(token: string): Observable<{ token: string; email: string; firstName: string; lastName: string; image: string; role: string }> {
  return this.http.post<{ token: string; email: string; firstName: string; lastName: string; image: string; role: string }>(
    `${this.baseUrl}/google`,
    { token }
  ).pipe(
    tap(response => {
      // Sauvegarder le JWT dans le stockage local et les données utilisateur
      this.saveToken(response.token);
      localStorage.setItem('user', JSON.stringify(response));

      // Rediriger vers la page d'accueil
      window.location.href = '/home';  // Ou utiliser Angular Router
    }),
    catchError(error => {
      console.error('Erreur de connexion Google', error);
      return throwError(() => new Error('Échec de la connexion avec Google'));
    })
  );
}




}






  
