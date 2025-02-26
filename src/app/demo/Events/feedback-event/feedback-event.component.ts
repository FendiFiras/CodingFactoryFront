import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/Service/event.service';
import { FeedBackEvent } from 'src/app/Model/feedBackEvent.model';
import { Registration } from 'src/app/Model/registration.model';

@Component({
  selector: 'app-feedback-event',
  standalone: true,
  imports: [CommonModule], // Importer CommonModule pour utiliser *ngFor
  templateUrl: './feedback-event.component.html',
  styleUrl: './feedback-event.component.scss'
})
export class FeedbackEventComponent implements OnInit {
  idEvent!: number;
  feedbacks: FeedBackEvent[] = [];
  registrations: Registration[] = [];

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis l'URL avant de charger les commentaires
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idEvent = +id;
        this.loadFeedbacks();
        this.loadRegistration();

      }
    });
  }

  // Charger les feedbacks de l'événement donné
  loadFeedbacks(): void {
    this.eventService.getComments(this.idEvent).subscribe((data) => {
      this.feedbacks = data;
    });
  }
// Charger les Registration de l'événement donné
loadRegistration(): void {
  this.eventService.getRegistrations(this.idEvent).subscribe((data) => {
    this.registrations = data;
  });
}

  deleteFeedBack(idFeedBackEvent: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) {
      this.eventService.deleteFeedBackEvent(idFeedBackEvent).subscribe(
        () => {
          // Supprimer l'événement de la liste
          this.loadFeedbacks();
          alert('FeedBack supprimé avec succès.');
        },
        (error) => {
          alert('Une erreur est survenue lors de la suppression du feedBack.');
        }
      );
    }
  }





  deleteRegistration(idRegistration: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce participant de l'évenement ?")) {
      this.eventService.deleteRegistration(idRegistration).subscribe(
        () => {
          // Supprimer l'événement de la liste
          this.loadRegistration();
          alert('Participant supprimé avec succès.');
        },
        (error) => {
          alert('Une erreur est survenue lors de la suppression du participant.');
        }
      );
    }
  }
  
}
