
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Partnership } from '../models/Partnership';


@Injectable({
  providedIn: 'root',
})
export class PartnershipService {
  private apiUrl = "http://localhost:8089/pidev/partnerships" // Base URL for partnerships
  readonly ENDPOINT_GET = "/Get"
  constructor(private http: HttpClient) {}
/*
  // ✅ Apply for a partnership (Send FormData)
  applyForPartnership(partnership: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, partnership);
  }

  // ✅ Get all partnerships
  getPartnerships(): Observable<Partnership[]> {
    return this.http.get<Partnership[]>(`${this.apiUrl}/Get`);
  }*/

    getPartnerships() {
      return this.http.get(this.apiUrl+this.ENDPOINT_GET);
    }
   /* applyForPartnership(partnership: Partnership): Observable<Partnership> {
      return this.http.post<Partnership>(`${this.apiUrl}/apply`, partnership);
    }
      applyForPartnership(partnershipData: Partnership, userId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/apply/${userId}`, partnershipData);
      }*/
        applyForPartnership(partnershipData: any, userId: number): Observable<any> {
          return this.http.post<any>(`${this.apiUrl}/apply/${userId}`, partnershipData, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          });
        }
        
        
      
      
      getUserDetails(userId: number): Observable<any> {
        // Correct URL format for user details endpoint
        return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
      }
      
    
      // Get partnership by ID
  getPartnershipById(id: number): Observable<Partnership> {
    return this.http.get<Partnership>(`${this.apiUrl}/details/${id}`);
  }

  // Update partnership
  updatePartnership(id: number, partnership: Partnership): Observable<Partnership> {
    return this.http.put<Partnership>(`${this.apiUrl}/update-partnership/${id}`, partnership);
  }

  

  // Delete partnership
  deletePartnership(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-partnership/${id}`);
  }
    
}
