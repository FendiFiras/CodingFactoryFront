import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { MessageService } from 'src/app/service/message.service';
import { ConfigurationComponent } from "../../../theme/layout/admin/configuration/configuration.component";

@Component({
  selector: 'app-admin-discussion-messages',
  templateUrl: './admin-discussion-messages.component.html',
  styleUrls: ['./admin-discussion-messages.component.scss'],
  imports: [CommonModule, FormsModule, ConfigurationComponent], // ✅ Importez CommonModule ici

})
export class AdminDiscussionMessagesComponent implements OnInit {
  navMobClick() {
    throw new Error('Method not implemented.');
  }
  selectedImage: string | ArrayBuffer | null = null; // Pour stocker l'aperçu de l'image
  selectedFile: File | null = null; // Pour stocker le fichier sélectionné
  editSelectedFile: File | null = null; // Pour stocker le fichier sélectionné lors de la modification
  editSelectedImage: string | ArrayBuffer | null = null; // Pour la modification d'un message

  forumId!: number; // ✅ Déclarez forumId
  discussionId!: number;
  messages: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
   navCollapsed = false;
   navCollapsedMob = false;

   // Variables pour gérer l'ajout et la modification de messages
  newMessageDescription: string = '';
  editMessageId: number | null = null;
  editMessageDescription: string = '';


  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router, // ✅ Injectez le Router ici
    private discussionService: DiscussionService,

  ) {}


  // Méthode pour revenir à la liste des discussions
  goBack(): void {
    this.router.navigate([`/admin/forum/${this.forumId}/discussions`]); 
  }

  ngOnInit(): void {
    this.forumId = +this.route.snapshot.paramMap.get('forumId')!; 
    this.discussionId = +this.route.snapshot.paramMap.get('discussionId')!;
    this.loadMessages();
  }


   // Charger les messages
   loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesByDiscussion(this.discussionId).subscribe({
      next: (data) => {
        this.messages = data.map((message) => ({
          ...message,
          userId: message.userId ?? 'Inconnu',
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des messages';
        this.isLoading = false;
      },
    });
  }


   // Méthode pour gérer la sélection de fichier
   onEditFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editSelectedFile = file;
  
      // Afficher un aperçu de la nouvelle image
      const reader = new FileReader();
      reader.onload = () => {
        this.editSelectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Ajouter un message
  // Méthode pour ajouter un message avec une image
  addMessage(): void {
    if (!this.newMessageDescription.trim()) {
      this.errorMessage = 'Veuillez entrer une description pour le message.';
      return;
    }

    const userId = 1; // Remplacez par l'ID de l'utilisateur connecté

    // Créer un FormData pour envoyer le message et l'image
    const formData = new FormData();
    formData.append('userId', '1'); // Remplacez par l'ID de l'utilisateur connecté
    formData.append('discussionId', this.discussionId.toString());
    formData.append('description', this.newMessageDescription);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.messageService.addMessageWithImage(formData).subscribe({
      next: (message) => {
        this.messages.push(message); // Ajouter le nouveau message à la liste
        this.newMessageDescription = ''; // Réinitialiser le champ de saisie
        this.selectedImage = null; // Réinitialiser l'aperçu de l'image
        this.selectedFile = null; // Réinitialiser le fichier sélectionné
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du message';
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      // Afficher un aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


 // Méthode pour démarrer la modification d'un message
 editMessage(messageId: number, description: string, imageUrl: string): void {
  this.editMessageId = messageId;
  this.editMessageDescription = description;
  this.editSelectedImage = imageUrl ? 'http://localhost:8089/images/' + imageUrl : null; // Afficher l'image actuelle
  this.editSelectedFile = null; // Réinitialiser le fichier sélectionné
}

// Méthode pour sauvegarder les modifications d'un message
saveMessage(): void {
  if (!this.editMessageDescription.trim()) {
    this.errorMessage = 'Veuillez entrer une description pour le message.';
    return;
  }

  if (this.editMessageId !== null) {
    const formData = new FormData();
    formData.append('description', this.editMessageDescription);
    if (this.editSelectedFile) {
      formData.append('image', this.editSelectedFile);
    }

    this.messageService.updateMessageWithImage(this.editMessageId, formData).subscribe({
      next: (message) => {
        const index = this.messages.findIndex((m) => m.message_id === this.editMessageId);
        if (index !== -1) {
          this.messages[index].description = message.description; // Mettre à jour la description
          this.messages[index].image = message.image; // Mettre à jour l'image
        }
        this.editMessageId = null; // Réinitialiser l'édition
        this.editMessageDescription = '';
        this.editSelectedImage = null;
        this.editSelectedFile = null;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la modification du message';
      },
    });
  }
}



  // Supprimer un message
  deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.messageService.deleteMessage(messageId).subscribe({
        next: () => {
          this.messages = this.messages.filter((m) => m.message_id !== messageId); // Retirer le message de la liste
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du message';
        },
      });
    }
  }


}