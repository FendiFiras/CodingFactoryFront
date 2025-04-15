import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importez FormsModule
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers:[], // Importez FormsModule ici,

  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
  
})

export class AddEventComponent {
  event: any = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: null,
    registrationDeadline: '',
    price: null,
    eventType: '',
    imageUrl: null,
    videoUrl: null
  };

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;

  constructor(private eventService:EventService,private router:Router) {}

  onImageSelected(event: any) {
    this.selectedImageFile = event.target.files[0];
  }

  onVideoSelected(event: any) {
    this.selectedVideoFile = event.target.files[0];
  }

  async onSubmit(eventForm: NgForm) {


    if (this.isValid()) {
    
      // Upload de l'image
      try {
        if (this.selectedImageFile) {
          const imageUrl = await this.eventService.uploadFile(this.selectedImageFile);
          this.event.imageUrl = imageUrl;
          console.log("Image URL:", this.event.imageUrl);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
      }
      
      try {
        if (this.selectedVideoFile) {
          const videoUrl = await this.eventService.uploadFile(this.selectedVideoFile);
          this.event.videoUrl = videoUrl;
        }
      } catch (error) {
        console.error("Erreur lors de l'upload de la vidéo :", error);
      }
      

      // Ajouter l'événement
      await this.saveEvent();
      console.log('Événement ajouté avec succès');
     // this.router.navigate(['/events']); // Redirige vers la page des événements
           this.router.navigate(['/listevents']); // Redirection ici

    
  }
}

  async saveEvent() {
    try {
      const response = await this.eventService.addEvent(this.event);
      console.log('Événement ajouté avec succès:', response);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw error; // Propager l'erreur pour la gérer dans onSubmit
    }
  }



  isValid(): boolean {
    // Vérifier les validations personnalisées
    if (new Date(this.event.startDate) >= new Date(this.event.endDate)) {
      return false;
    }

    if (new Date(this.event.registrationDeadline) >= new Date(this.event.endDate)) {
      return false;
    }

    if (this.event.price < 0) {
      return false;
    }

    if (this.event.maxParticipants < 1) {
      return false;
    }

    return true;  // Tout est valide
  }

  isStartDateInvalid(): boolean {
    const now = new Date(); // Date actuelle
    const startDate = new Date(this.event.startDate);
    const endDate = new Date(this.event.endDate);
  
    if (!this.event.startDate) {
      return false;
    }
  
    // Vérifie si la date de début est dans le passé
    if (startDate < now) {
      return true;
    }
  
    // Vérifie si la date de début est après la date de fin
    if (this.event.endDate && startDate >= endDate) {
      return true;
    }
  
    return false;
  }
  
  
  isRegistrationDeadlineInvalid(): boolean {
    return this.event.registrationDeadline && this.event.endDate
      ? new Date(this.event.registrationDeadline) >= new Date(this.event.endDate)
      : false;
  }
  
}
 