import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Event as EventModel } from 'src/app/Model/event.model';
import { EventService } from 'src/app/Service/event.service';
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

  constructor(private eventService: EventService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadEvents();
    this.idUser = 1;
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.events.forEach(event => this.loadQRCode(event.idEvent));
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
}