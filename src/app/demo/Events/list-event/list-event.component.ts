import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Service/event.service';
import { Event as EventModel } from 'src/app/Model/event.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private eventService: EventService) {}

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

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.events = this.events.filter(event => event.idEvent !== id);
      });
    }
  }

  openModifyPopup(event: EventModel): void {
    this.selectedEvent = { ...event }; // Copie l'événement sélectionné pour modification

    console.log('Open modify popup for:', event);
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
}
