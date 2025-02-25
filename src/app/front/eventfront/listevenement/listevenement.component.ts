import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { Event as EventModel } from 'src/app/Model/event.model';
import { EventService } from 'src/app/Service/event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listevenement',
  standalone:true,
    imports: [NavbarComponent,FooterComponent,CommonModule, FormsModule,RouterModule], // Import NavbarComponent here
  templateUrl: './listevenement.component.html',
  styleUrl: './listevenement.component.scss'
})
export class ListevenementComponent implements OnInit {
    events: EventModel[] = [];
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

}
