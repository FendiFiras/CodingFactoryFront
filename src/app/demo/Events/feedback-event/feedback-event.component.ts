import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/Service/event.service';
import { FeedBackEvent } from 'src/app/Model/feedBackEvent.model';
import { Registration } from 'src/app/Model/registration.model';
import { Planning } from 'src/app/Model/planning.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-event',
  standalone: true,
  imports: [FormsModule, CommonModule], // Importer CommonModule pour utiliser *ngFor
  templateUrl: './feedback-event.component.html',
  styleUrl: './feedback-event.component.scss'
})
export class FeedbackEventComponent implements OnInit {
  idEvent!: number;
  idLocation!: number;
  feedbacks: FeedBackEvent[] = [];
  registrations: Registration[] = [];
  plannings: Planning[]=[];
  newPlanning!: Planning;
  isPlanningModalOpen = false; // Contrôle du modal
  selectedVideoFile: File | null = null;
  locationType: string[] = ['IN_PERSON','ONLINE'];
  isEditPlanningModalOpen = false;
  selectedPlanning: Planning | null = null;



  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis l'URL avant de charger les commentaires
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idEvent = +id;
        this.loadFeedbacks();
        this.loadRegistration();
        this.idLocation=0;
        this.loadPlanning();

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

 // Charger les plannings de l'événement donné
 loadPlanning(): void {
  this.eventService.getPlanning(this.idEvent).subscribe((data) => {
    this.plannings = data;
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


  //add Planning

  
  async addPlanning(): Promise<void> {
  
  this.eventService.addPlanning(this.newPlanning,this.idEvent,this.idLocation).subscribe(() => {
    this.loadPlanning(); // Rafraîchir la liste après l'ajout
  });
}



openPlanningModal(): void {
  this.newPlanning = {
    idPlanning: 0,                // ID initialisé à 0 pour un nouvel élément
    startDatetime:'',    // Date actuelle pour le début
    endDatetime: '',      // Date actuelle pour la fin (peut être modifiée ensuite)
    description: '',              // Description vide au début
    video: '',                    // Video vide
    locationType: ''              // Type de localisation vide
  };
  this.isPlanningModalOpen = true;
  console.log("Modal ouvert pour ajouter un planning");
}

// Fermer le modal
closePlanningModal(): void {
  this.isPlanningModalOpen = false;
}


 // Soumettre le formulaire d'ajout de planning
 async submitPlanning(): Promise<void> {
  if (!this.newPlanning.startDatetime || !this.newPlanning.endDatetime || !this.newPlanning.description) {
    alert('Veuillez remplir tous les champs requis.');
    return;
  }
  try {
    console.log("videooooooooooo"+this.selectedVideoFile)
    if (this.selectedVideoFile) {
      const videoUrl = await this.eventService.uploadFile(this.selectedVideoFile);
      this.newPlanning.video = videoUrl;
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la vidéo :", error);
  }

  this.eventService.addPlanning(this.newPlanning, this.idEvent, this.idLocation).subscribe(() => {
    this.loadPlanning(); // Recharger la liste après ajout
    this.closePlanningModal(); // Fermer le modal
    alert('Planning ajouté avec succès !');
  });
}

// Supprimer un planning
deletePlanning(idPlanning: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce planning ?')) {
    this.eventService.deletePlanning(idPlanning).subscribe(() => {
      this.loadPlanning();
      alert('Planning supprimé avec succès.');
    });
  }
}



onVideoSelected(event: any) {
  this.selectedVideoFile = event.target.files[0];
}





// Ouvrir le modal de modification en double-cliquant sur une ligne du tableau
openEditPlanningModal(planning: Planning): void {
  this.selectedPlanning = { ...planning };
  this.isEditPlanningModalOpen = true;
}

// Fermer le modal de modification
closeEditPlanningModal(): void {
  this.isEditPlanningModalOpen = false;
  this.selectedPlanning = null;
}

// Modifier un planning
async submitEditPlanning(): Promise<void> {
  if (!this.selectedPlanning) return;

  if (!this.selectedPlanning.startDatetime || !this.selectedPlanning.endDatetime || !this.selectedPlanning.description) {
    alert('Veuillez remplir tous les champs requis.');
    return;
  }

  try {
    if (this.selectedVideoFile) {
      const videoUrl = await this.eventService.uploadFile(this.selectedVideoFile);
      this.selectedPlanning.video = videoUrl;
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de la vidéo :", error);
  }

  this.eventService.updatePlanning(this.selectedPlanning,this.idEvent,0).subscribe(() => {
    this.loadPlanning();
    this.closeEditPlanningModal();
    alert('Planning modifié avec succès !');
  });
}
  
}
