import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event as EventModel } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FeedBackEvent } from 'src/app/models/feedBackEvent.model';
import { AuthService } from 'src/app/services/auth-service.service';


@Component({
  selector: 'app-detailevent',
  standalone:true,
    imports: [NavbarComponent,FooterComponent,CommonModule, FormsModule,RouterModule],
  templateUrl: './detailevent.component.html',
  styleUrl: './detailevent.component.scss'
})
export class DetaileventComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string ='';

    event!: EventModel; // Stocke les détails de l'événement
  idEvent!: number; // Stocke l'ID de l'événement
  idUser!: number;
  userEmail: string = "firasabidhiaf11@gmail.com";  // Remplace avec l'email réel de l'utilisateur

    feedbacks: FeedBackEvent[] = [];
  
      constructor(private route: ActivatedRoute,private eventService: EventService,
        private authService: AuthService // ✅ Injecter le service



      ) {}
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.idEvent = +id;
            this.loadEventDetails();
          }
      
          // 🔁 Récupérer l'utilisateur connecté dynamiquement
          this.authService.getUserInfo().subscribe({
            next: (user) => {
              this.idUser = user.idUser; // ✅ ID réel
              this.userEmail = user.email; // Si nécessaire
              this.loadFeedbacks(); // Charger les feedbacks une fois qu'on a l'utilisateur
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
     // Méthode d'inscription et d'envoi de l'email
  register(): void {
    this.eventService.registerUser({}, this.idEvent, this.idUser).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie !';
        this.errorMessage = '';  // Réinitialiser le message d'erreur
        // Appeler la méthode pour envoyer l'email
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'inscription: ' + (err.error?.message || err.message);
        this.successMessage = '';  // Réinitialiser le message de succès
      }
    });
  }

  
// Charger les feedbacks de l'événement donné
loadFeedbacks(): void {
  this.eventService.getComments(this.idEvent).subscribe((data) => {
    this.feedbacks = data;
  });
}

getRatingArray(rating:number): number[] {
  return new Array(rating);
}

}