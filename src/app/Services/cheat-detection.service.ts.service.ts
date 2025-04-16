import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CheatDetectionServiceTsService {

  private apiUrl = 'http://localhost:8081/pidev/api/cheat/detect'; // 🔁 Ton endpoint Spring Boot


  constructor(private http: HttpClient) { }


  
  detectCheating(data: {
    duration: number;
    clicks: number;
    fast_answers: number;
    tab_switches: number;
    idle_time: number;
    wrong_answers: number;
    head_turns: number;
  }): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, data);
  }
}
