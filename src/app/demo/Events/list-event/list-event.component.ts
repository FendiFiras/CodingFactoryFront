import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event as EventModel } from 'src/app/models/event.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.scss'
})
export class ListEventComponent implements OnInit {
  events: EventModel[] = [];
  selectedEvent: EventModel | null = null;
  sdate:any="";
  sfin:any="";
  // Liste des types d'événements disponibles (extrait de ton enum)
  eventTypes: string[] = ['CONFERENCE', 'WORKSHOP', 'MEETUP'];
  searchTerm:string="";

  constructor(private eventService: EventService,private router:Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des événements', error);
      }
    );
  }

  // Méthode pour naviguer vers la page FeedbackEventComponent
  goToEventDetails(eventId: number): void {
    this.router.navigate([`/feedback/${eventId}`]);  // Navigation vers FeedbackEventComponent avec l'ID de l'événement
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.events = this.events.filter(event => event.idEvent !== id);
      });
    }
  }

  openModifyPopup(event: EventModel): void {
    this.selectedEvent = { ...event }; // Copie l'événement sélectionné

    // Convertir les dates avant affichage
    if (this.selectedEvent.startDate) {
      this.selectedEvent.startDate = this.formatDateForInput(this.selectedEvent.startDate);
  }
  if (this.selectedEvent.endDate) {
      this.selectedEvent.endDate = this.formatDateForInput(this.selectedEvent.endDate);
  }
  if (this.selectedEvent.registrationDeadline) {
      this.selectedEvent.registrationDeadline = this.formatDateForInput(this.selectedEvent.registrationDeadline);
  
    }

  console.log('Event chargé pour modification:', this.selectedEvent);
}


  updateEvent(): void {
    if (this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent).subscribe(
        (updatedEvent) => {
          console.log('Event updated:', updatedEvent);
          this.loadEvents(); // Recharger les événements après modification
          this.selectedEvent = null; // Fermer le modal
        },
        (error) => {
          console.error('Error updating event', error);
        }
      );
    }
  }

  closeModal(): void {
    this.selectedEvent = null; // Fermer le modal
  }

  // ✅ Fonction pour gérer l'upload d'image ou de vidéo
  onFileSelected(event: any, type: string): void {
    const file = event.target.files[0];
    if (file) {
      this.eventService.uploadFile(file).then((url) => {
        if (this.selectedEvent) {
          if (type === 'image') {
            this.selectedEvent.imageUrl = url;
          } else if (type === 'video') {
            this.selectedEvent.videoUrl = url;
          }
        }
      }).catch(error => console.error('Upload failed', error));
    }
  }


  formatDateForInput(dateString: string ): string {
    if (!dateString) return '';
  
    let dateObj = new Date(dateString);
  
    if (isNaN(dateObj.getTime())) {
      // Si la date est sous forme de string "YYYY-MM-DD HH:mm:ss.ffffff", il faut la parser correctement
      const parts = dateString.split(' ');
      const datePart = parts[0]; // "2025-03-01"
      const timePart = parts[1] ? parts[1].substring(0, 5) : '00:00'; // "12:00"
  
      return `${datePart}T${timePart}`; // Format attendu par datetime-local
    }
  
    return dateObj.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }
  

  // Appel de la recherche via le service
  searchEvents(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
            this.loadEvents();
            return;
    }
    console.log("rechercheeeeee"+this.searchTerm)
    this.eventService.searchEvents(this.searchTerm)
      .subscribe(
        (data: EventModel[]) => {
          this.events = data;
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
