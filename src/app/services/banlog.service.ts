import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BanLog } from '../models/ban-log'; // Assurez-vous d'avoir un modèle BanLog

@Injectable({
  providedIn: 'root'
})
export class BanLogService {
  private apiUrl = 'http://localhost:8089/codingFactory/ban-logs'; // URL de base de votre backend

  constructor(private http: HttpClient) {}

  // Ajouter un BanLog pour un utilisateur spécifique
  addBanLog(userId: number, banLog: BanLog): Observable<BanLog> {
    const url = `${this.apiUrl}/${userId}`; // Ajout du "/ban"
    return this.http.post<BanLog>(url, banLog);
  }
  

  // Récupérer tous les BanLogs
  getAllBanLogs(): Observable<BanLog[]> {
    return this.http.get<BanLog[]>(this.apiUrl);
  }
  

  modifyBanLog(banLog: BanLog): Observable<BanLog> {
    const url = `${this.apiUrl}/${banLog.idBan}`; // L'ID est ajouté ici
    return this.http.put<BanLog>(url, banLog, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteBanLog(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

 

 
}