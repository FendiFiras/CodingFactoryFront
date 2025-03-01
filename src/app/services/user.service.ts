import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089/codingFactory/users'; // URL backend

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  registerUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(this.apiUrl, user, { headers });
  }
  getUsersByRole(role: string): Observable<User[]> {
    const url = `${this.apiUrl}/role/${role}`; // Endpoint pour récupérer les utilisateurs par rôle
    return this.http.get<User[]>(url);
  }
  modifyUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.idUser}`;  // Ajoutez l'ID dans l'URL
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(url, user, { headers });
  }
  

  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}