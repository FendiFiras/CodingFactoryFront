import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { Router } from '@angular/router';
import { EventService } from 'src/app/Service/event.service';


@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [FormsModule],
  providers:[], // Importez FormsModule ici,

  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
  
})

export class AddEventComponent {
  event: any = {}; // Initialisation avec un objet vide

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;

  constructor(private eventService:EventService,private router:Router) {}

  onImageSelected(event: any) {
    this.selectedImageFile = event.target.files[0];
  }

  onVideoSelected(event: any) {
    this.selectedVideoFile = event.target.files[0];
  }

  async onSubmit() {
    
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
}
 