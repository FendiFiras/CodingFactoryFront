import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event as EventModel } from 'src/app/Model/event.model';
import { EventService } from 'src/app/Service/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';


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
      register() {
        this.eventService.registerUser({}, this.idEvent, this.idUser).subscribe({
            next: () => {
                this.successMessage = ' Inscription réussie !';
                this.errorMessage = ''; // Réinitialiser le message d'erreur
            },
            error: (err) => {
                this.errorMessage = ' ' + err.message;
                this.successMessage = ''; // Réinitialiser le message de succès
            }
        });
    
    
     

}


}