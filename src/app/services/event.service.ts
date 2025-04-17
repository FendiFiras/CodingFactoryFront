import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, take, throwError } from 'rxjs';
import { Event } from '../models/event.model'; // Adjust the path as needed
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Planning } from '../models/planning.model';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { LocationEvent } from '../models/locationEvent.model';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8087/event'; // Adjust the URL if needed

  private stompClient: Client | null = null;
  private stompConnected = new BehaviorSubject<boolean>(false);

  private participantCounts: { [key: number]: BehaviorSubject<number> } = {};
  constructor(private http: HttpClient, private zone: NgZone) {}
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
      return this.http.post(`${this.apiUrl}/addfeedback/${eventId}/${userId}`, comment, {
        responseType: 'text' as 'json'  // 👈 Corrige l'erreur de parsing JSON
      });
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
  getPlanningById(id: number): Observable<Planning> {
    return this.http.get<Planning>(`${this.apiUrl}/getplanning/${id}`);
}

  addPlanning(planning: any, eventId: number,locationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addplanning/${eventId}/${locationId}`, planning
    );
  }

  deletePlanning(idPlanning: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteplanning/${idPlanning}`);
  }


  updatePlanning(planning: Planning,idEvent: number, idLocationEvent: number): Observable<Planning> {
    return this.http.put<Planning>(`${this.apiUrl}/updateplanning/${idEvent}/${idLocationEvent}`, planning);
  }

  getQRCode(eventId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8087/event/qrcode/${eventId}`, { responseType: 'blob' });
}


// Recherche d'événements via un PathVariable "s"
searchEvents(s: string): Observable<Event[]> {
  return this.http.get<Event[]>(`${this.apiUrl}/searchevent/${s}`);
}
  

getParticipantCount(idEvent: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count/${idEvent}`);
}

 // ✅ WebSocket pour mise à jour en temps réel
 connectWebSocket(): Promise<void> {
  return new Promise((resolve) => {
    if (this.stompClient && this.stompClient.active) {
      resolve(); // Déjà connecté
      return;
    }

    const socket = new SockJS('http://localhost:8087/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => console.log(msg),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket connecté');
      this.stompConnected.next(true);
      resolve(); // Confirmer que la connexion est prête
    };

    this.stompClient.activate();
  });
}

subscribeToParticipantUpdates(eventId: number): Observable<number> {
  if (!this.participantCounts[eventId]) {
    this.participantCounts[eventId] = new BehaviorSubject<number>(0);
  }

  return new Observable<number>((observer) => {
    this.stompConnected.pipe(filter(connected => connected), take(1)).subscribe(() => {
      this.stompClient?.subscribe(`/topic/event/${eventId}`, (message) => {
        console.log(`📩 Mise à jour pour l'événement ${eventId}:`, message.body);
        const newCount = JSON.parse(message.body);
        
        // 🔹 Assurez-vous que le changement est détecté par Angular
        this.zone.run(() => {
          this.participantCounts[eventId].next(newCount);
          observer.next(newCount);
        });
      });
    });
  });
}




// ✅ Ajouter une location
addLocation(location: LocationEvent): Observable<LocationEvent> {
  return this.http.post<LocationEvent>(`${this.apiUrl}/addlocation`, location);
}

// ✅ Mettre à jour une location
updateLocation(location: LocationEvent): Observable<LocationEvent> {
  return this.http.put<LocationEvent>(`${this.apiUrl}/updatelocation`, location);
}

// ✅ Récupérer une location par ID
getLocationById(id: number): Observable<LocationEvent> {
  return this.http.get<LocationEvent>(`${this.apiUrl}/getlocation/${id}`);
}

// ✅ Supprimer une location
deleteLocation(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deletelocation/${id}`);
}

// ✅ Récupérer toutes les locations
getAllLocations(): Observable<LocationEvent[]> {
  return this.http.get<LocationEvent[]>(`${this.apiUrl}/alllocation`);
}
//**************AI */

private baseUrl = 'http://localhost:8091/analyze'; // URL de l’API FastAPI

analyzeVideo(filename: string) {
  const requestBody = { filename };  // Crée l'objet contenant le champ `filename`
  return this.http.post<any>(this.baseUrl, requestBody);  // Envoi l'objet dans la requête POST
}

}



