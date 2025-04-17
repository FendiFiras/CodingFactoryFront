import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event as EventModel } from 'src/app/models/event.model';
import { FeedBackEvent } from 'src/app/models/feedBackEvent.model';
import { Planning } from 'src/app/models/planning.model';
import { AuthService } from 'src/app/services/auth-service.service';


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
    plannings: Planning[]=[];
  feedbacks: FeedBackEvent[] = [];
  newFeedback: FeedBackEvent = { idFeedback: 0, rating: 0, comments: '' };
  selectedVideoUrl: string | null = null;


  
      constructor(private route: ActivatedRoute,private eventService: EventService,  private authService: AuthService // 👈 Ajoute ça
      ) {}
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.idEvent = +id;
            this.loadEventDetails();
            this.loadPlanning();
          }
      
          // ✅ Récupération de l'utilisateur connecté
          this.authService.getUserInfo().subscribe({
            next: (user) => {
              this.idUser = user.idUser;
              this.loadFeedbacks(); // Charger les feedbacks après avoir récupéré l'utilisateur
            },
            error: (err) => {
              console.error("Erreur récupération user connecté", err);
            }
          });
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
    console.log('Feedbacks reçus:', data); // <--- ajoute ça

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

deleteFeedback(id: number) {
  if (confirm('Voulez-vous vraiment supprimer ce feedback ?')) {
    this.eventService.deleteFeedBackEvent(id).subscribe(() => {
      this.feedbacks = this.feedbacks.filter(f => f.idFeedback !== id);
      this.loadFeedbacks(); // Recharge uniquement la liste des feedbacks

    });
  }
}

hasUserCommented(): boolean {
  return this.feedbacks.some(feedback => feedback.user.idUser === this.idUser);
}





//PLANNINGGGG


// Charger les plannings de l'événement donné
loadPlanning(): void {
  this.eventService.getPlanning(this.idEvent).subscribe((data) => {
    this.plannings = data.map(planning => {
      if (planning.locationType === 'IN_PERSON' && planning.locationEvent) {
        // Générer un lien Google Maps basé sur latitude et longitude
        planning['googleMapsUrl'] = `https://www.google.com/maps?q=${planning.locationEvent.latitude},${planning.locationEvent.longitude}`;
      }
      return planning;
    });
  });
}

  


shareOnFacebook(): void {
  if (this.event) {
    // Construire le lien de l'événement avec son ID
    const eventUrl = `http://localhost:4200/detailseventfront/${this.idEvent}`;

    // Ajouter le titre de l'événement dans l'URL
    const shareText = `Join our event: ${this.event.title} - ${eventUrl}`;
    
    // Encoder l'URL et le texte
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(eventUrl);

    // Lien de partage Facebook
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;

    // Ouvrir la fenêtre de partage
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  } else {
    console.error("L'événement n'est pas encore chargé.");
  }
}





playVideo(videoUrl: string): void {
  // Réinitialiser temporairement l'URL pour forcer la mise à jour
  this.selectedVideoUrl = null;

  setTimeout(() => {
    this.selectedVideoUrl = `http://localhost:8087/event/${videoUrl}`;
  }, 100); // Petit délai pour que Angular détecte le changement
  this.analyze(videoUrl);

}


openGoogleMapsPopup(event: Event, mapUrl: string): void {
  // Empêche la redirection du lien
  event.preventDefault();

  // Ouvre Google Maps dans une nouvelle fenêtre (pop-up)
  window.open(mapUrl, '_blank', 'width=800,height=600');
}
toggleDetails(event: Event) {
  const header = event.currentTarget as HTMLElement;
  const details = header.nextElementSibling as HTMLElement;
  const toggle = header.querySelector('.planning-item__toggle') as HTMLElement;

  // Toggle the active class on the details section
  details.classList.toggle('active');
  
  // Toggle the active class on the toggle div to rotate the chevron
  toggle.classList.toggle('active');
}

result: any;


analyze(fname: string) {
  this.eventService.analyzeVideo(fname).subscribe({
    next: res => this.result = res,  // Traitement des résultats de la réponse
    error: err => console.error('Erreur analyse vidéo', err)  // Gestion des erreurs
  });
}





      }


        
      
  