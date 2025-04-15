import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import { FeedBackEvent } from 'src/app/models/feedBackEvent.model';
import { Registration } from 'src/app/models/registration.model';
import { Planning } from 'src/app/models/planning.model';
import { FormsModule } from '@angular/forms';
import { LocationEvent } from 'src/app/models/locationEvent.model'; // Import LocationEvent model

@Component({
  selector: 'app-feedback-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './feedback-event.component.html',
  styleUrl: './feedback-event.component.scss'
})
export class FeedbackEventComponent implements OnInit {
  idEvent!: number;
  idLocation!: number;
  feedbacks: FeedBackEvent[] = [];
  registrations: Registration[] = [];
  plannings: Planning[] = [];
  newPlanning!: Planning;
  isPlanningModalOpen = false;
  selectedVideoFile: File | null = null;
  locationType: string[] = ['IN_PERSON', 'ONLINE'];
  isEditPlanningModalOpen = false;
  selectedPlanning: Planning | null = null;
  locations: LocationEvent[] = []; // To store the list of locations
loc:string;
  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    // Fetch all locations when the component initializes
    this.loadLocations();

    // Récupérer l'ID de l'événement depuis l'URL avant de charger les commentaires
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idEvent = +id;
        this.loadFeedbacks();
        this.loadRegistration();
        this.idLocation = 0;
        this.loadPlanning();
      }
    });
  }

  // Fetch all locations
  loadLocations(): void {
    this.eventService.getAllLocations().subscribe((data) => {
      this.locations = data;
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
          this.loadRegistration();
          alert('Participant supprimé avec succès.');
        },
        (error) => {
          alert('Une erreur est survenue lors de la suppression du participant.');
        }
      );
    }
  }

  openPlanningModal(): void {
    this.newPlanning = {
      idPlanning: 0,
      startDatetime: '',
      endDatetime: '',
      description: '',
      video: '',
      locationType: ''
    };
    this.idLocation = 0; // Reset idLocation
    this.selectedVideoFile = null; // Reset video file
    this.isPlanningModalOpen = true;
    console.log("Modal ouvert pour ajouter un planning");
  }

  closePlanningModal(): void {
    this.isPlanningModalOpen = false;
  }

  async submitPlanning(): Promise<void> {
    if (!this.newPlanning.startDatetime || !this.newPlanning.endDatetime || !this.newPlanning.description || !this.newPlanning.locationType) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    try {
      console.log("aaaaaaa"+this.newPlanning);

      if (this.selectedVideoFile) {
        const videoUrl = await this.eventService.uploadFile(this.selectedVideoFile);
        this.newPlanning.video = videoUrl;
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de la vidéo :", error);
    }

    this.eventService.addPlanning(this.newPlanning, this.idEvent, this.idLocation).subscribe(() => {
      this.loadPlanning();
      this.closePlanningModal();
      alert('Planning ajouté avec succès !');
    });
  }

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

  openEditPlanningModal(planning: Planning): void {
    this.eventService.getPlanningById(planning.idPlanning).subscribe((data: Planning) => {
        this.selectedPlanning = data;

        console.log("Planning reçu :", this.selectedPlanning);

        // Assurer que idLocation est bien mis à jour
        this.idLocation = this.selectedPlanning.locationEvent ? this.selectedPlanning.locationEvent.idLocal : null;
        console.log("ID Location récupéré :", this.idLocation);

        this.selectedVideoFile = null; // Reset du fichier vidéo
        this.isEditPlanningModalOpen = true;
    }, error => {
        console.error("Erreur lors de la récupération du planning :", error);
    });
}

  closeEditPlanningModal(): void {
    this.isEditPlanningModalOpen = false;
    this.selectedPlanning = null;
  }

  async submitEditPlanning(): Promise<void> {
    if (!this.selectedPlanning) return;

    if (!this.selectedPlanning.startDatetime || !this.selectedPlanning.endDatetime || !this.selectedPlanning.description || !this.selectedPlanning.locationType) {
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




    this.eventService.updatePlanning(this.selectedPlanning, this.idEvent, this.idLocation).subscribe(() => {
      this.loadPlanning();
      this.closeEditPlanningModal();
      alert('Planning modifié avec succès !');
    });
  }

  // Update idLocation when a location is selected
  onLocationChange(locationId: string): void {
    this.idLocation = +locationId; // Convert string to number
  }
}