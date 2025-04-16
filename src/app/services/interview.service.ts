import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Interview } from '../models/Interview';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8083/pidev/interview'; // Your backend URL

  constructor(private http: HttpClient) {}

  scheduleInterview(applicationId: number, interviewDate: string, interviewTime: string): Observable<any> {
    const params = new HttpParams()
      .set('applicationId', applicationId.toString())
      .set('interviewDate', interviewDate)  // yyyy-MM-dd
      .set('interviewTime', interviewTime);  // HH:mm

    return this.http.post(this.apiUrl, null, { params });
  }

  getInterviewsByStudent(studentId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/student/${studentId}`);
  }
}
