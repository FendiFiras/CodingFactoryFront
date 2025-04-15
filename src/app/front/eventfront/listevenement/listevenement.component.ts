import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Event as EventModel } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-listevenement',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './listevenement.component.html',
  styleUrl: './listevenement.component.scss'
})
export class ListevenementComponent implements OnInit {
  events: EventModel[] = [];
  isAlreadyRegistered: boolean | null = null;
  idUser: number = 0;
  qrCodes: { [key: number]: SafeUrl } = {}; // Stocker les QR Codes

  participantsCount: { [key: number]: number } = {}; // Stockage du nombre de participants

  constructor(private eventService: EventService, private router: Router, private sanitizer: DomSanitizer) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.eventService.connectWebSocket();
      await this.loadEvents();
      this.idUser = 1;
    } catch (error) {
      console.error("Erreur lors de l'initialisation", error);
    }
  }
  

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.events.forEach(event => {this.loadQRCode(event.idEvent)

          this.loadParticipantCount(event.idEvent);
          this.subscribeToRealTimeUpdates(event.idEvent);
// 🔹 Attendre la connexion WebSocket avant d'abonner aux mises à jour
/*this.eventService.subscribeToParticipantUpdates(event.idEvent).subscribe(newCount => {
  console.log(`🟢 Mise à jour en temps réel pour l'événement ${event.idEvent}: ${newCount}`);
  this.participantsCount[event.idEvent] = newCount;
});*/
        });

      },
      (error) => {
        console.error('Erreur lors du chargement des événements', error);
      }
    );
  }

  loadQRCode(eventId: number) {
    this.eventService.getQRCode(eventId).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.qrCodes[eventId] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du QR code', error);
        // Afficher un message ou une image par défaut si nécessaire
      }
    });
  }

  checkParticipation(idEvent: number): void {
    this.eventService.checkUserParticipation(idEvent, this.idUser).subscribe(
      (response: boolean) => {
        this.isAlreadyRegistered = response;
        if (this.isAlreadyRegistered) {
          this.router.navigate([`/planningeventfront/${idEvent}`]);
        } else {
          this.router.navigate([`/detailseventfront/${idEvent}`]); // Redirection vers les détails
        }
      },
      (error) => {
        this.isAlreadyRegistered = null;
      }
    );
  }

  loadParticipantCount(eventId: number): void {
    this.eventService.getParticipantCount(eventId).subscribe({
      next: (count) => {
        this.participantsCount[eventId] = count;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du nombre de participants', error);
        this.participantsCount[eventId] = 0; // Valeur par défaut
      }
    });
  }


  subscribeToRealTimeUpdates(eventId: number): void {
    this.eventService.subscribeToParticipantUpdates(eventId).subscribe(newCount => {
      this.participantsCount[eventId] = newCount;
    });
  }
}