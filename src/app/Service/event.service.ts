import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Event } from '../Model/event.model'; // Adjust the path as needed
import { HttpClient } from '@angular/common/http';
import { Planning } from '../Model/planning.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8089/event'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}
  uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData).toPromise()
      .then(response => response.url);
  }
  
  // Convertir en Promise
  addEvent(event: Event): Promise<Event> {
    return this.http.post<Event>(`${this.apiUrl}/add-event`, event).toPromise();
  }

  

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/event`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/retrieve-Event/${id}`);
  }

  

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/modify-event`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-event/${id}`);
  }




  registerUser(registration: any, eventId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/add/${eventId}/${userId}`, registration)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error));
        })
      );
    }



     // Ajouter un commentaire
  addComment(comment: any, eventId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addfeedback/${eventId}/${userId}`, comment);
  }

  // Récupérer les commentaires d'un événement
  getComments(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/feedbackevent/${eventId}`);
  }


//delete FeedBack
  deleteFeedBackEvent(idFeedBackEvent: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletefeedback/${idFeedBackEvent}`);
  }





   // Récupérer les commentaires d'un événement
   getRegistrations(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/registration/${eventId}`);
  }


//delete FeedBack
  deleteRegistration(idRegistration: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteregistration/${idRegistration}`);
  }

//verfier participation 
  checkUserParticipation(eventId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkparticipant/${eventId}/${userId}`);
  }



  // PLANNING 
  getPlanning(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/planningevent/${eventId}`);
  }

  addPlanning(planning: any, eventId: number,locationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addplanning/${eventId}/${locationId}`, planning);
  }

  deletePlanning(idPlanning: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteplanning/${idPlanning}`);
  }


  updatePlanning(planning: Planning,idEvent: number, idLocationEvent: number): Observable<Planning> {
    return this.http.put<Planning>(`${this.apiUrl}/updateplanning/${idEvent}/${idLocationEvent}`, planning);
  }

  getQRCode(eventId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8089/event/qrcode/${eventId}`, { responseType: 'blob' });
}
  
}
