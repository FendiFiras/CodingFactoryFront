import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from 'src/app/Service/event.service';
import { Event as EventModel } from 'src/app/Model/event.model';
import { FeedBackEvent } from 'src/app/Model/feedBackEvent.model';


@Component({
  selector: 'app-planning-event',
   standalone:true,
      imports: [NavbarComponent,FooterComponent,CommonModule, FormsModule,RouterModule], // Import NavbarComponent here
  templateUrl: './planning-event.component.html',
  styleUrl: './planning-event.component.scss'
})
export class PlanningEventComponent implements OnInit {
  event!: EventModel; // Stocke les détails de l'événement
  idEvent!: number; // Stocke l'ID de l'événement
  idUser!: number;

  feedbacks: FeedBackEvent[] = [];
  newFeedback: FeedBackEvent = { idFeedback: 0, rating: 0, comments: '' };

  
      constructor(private route: ActivatedRoute,private eventService: EventService) {}
      ngOnInit(): void {
        // Récupérer l'ID depuis l'URL
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.idEvent = +id; // Convertir en nombre
            this.loadEventDetails();
          }
          this.idUser=1;
          this.loadFeedbacks();

        });
      }
    
      // Charger les détails de l'événement
      loadEventDetails(): void {
        this.eventService.getEventById(this.idEvent).subscribe({
          next: (data) => {
            this.event = data;
          },
          error: (err) => {
            console.error("Erreur lors de la récupération de l'événement", err);
          }
        });
  }

// Charger les feedbacks de l'événement donné
loadFeedbacks(): void {
  this.eventService.getComments(this.idEvent).subscribe((data) => {
    this.feedbacks = data;
  });
}

// Ajouter un feedback
addFeedback(): void {
  this.eventService.addComment(this.newFeedback,this.idEvent,this.idUser).subscribe(() => {
    this.loadFeedbacks(); // Rafraîchir la liste après l'ajout
    this.newFeedback = { idFeedback: 0, rating: 0, comments: '' }; // Réinitialiser le formulaire
  });
}



getRatingArray(rating:number): number[] {
  return new Array(rating);
}


  
      }


        
      
    