import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { MessageService } from 'src/app/service/message.service';
import { ConfigurationComponent } from "../../../theme/layout/admin/configuration/configuration.component";
import { NavigationComponent } from "../../../theme/layout/admin/navigation/navigation.component";

@Component({
  selector: 'app-admin-discussion-messages',
  templateUrl: './admin-discussion-messages.component.html',
  styleUrls: ['./admin-discussion-messages.component.scss'],
  imports: [CommonModule, FormsModule, ConfigurationComponent, NavigationComponent], // ✅ Importez CommonModule ici
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
  filteredMessages: any[] = []; // Messages filtrés pour la recherche
  isLoading: boolean = false;
  errorMessage: string = '';
  navCollapsed = false;
  navCollapsedMob = false;
  showForm: boolean = false; // Contrôle l'affichage du formulaire
  isEditMode: boolean = false; // Pour distinguer entre ajout et modification
  currentMessageDescription: string = ''; // Propriété intermédiaire pour le champ de texte

  // Validation de la description
  get isDescriptionValid(): boolean {
    return this.currentMessageDescription.trim().length > 0;
  }

  // Variables pour gérer l'ajout et la modification de messages
  newMessageDescription: string = '';
  editMessageId: number | null = null;
  editMessageDescription: string = '';

  // Variables pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Variable pour la recherche
  searchQuery: string = '';

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

  // Méthode pour basculer l'affichage du formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newMessageDescription = '';
      this.currentMessageDescription = '';
      this.selectedImage = null;
      this.selectedFile = null;
      this.isEditMode = false;
      this.editMessageId = null; // Réinitialiser l'ID du message en cours d'édition
      this.editSelectedImage = null;
      this.editSelectedFile = null;
    }
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
          userId: message.userId ?? 'zitouni',
        }));
        this.filteredMessages = [...this.messages]; // Initialiser les messages filtrés
        this.updatePagination();
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
  addMessage(): void {
    if (!this.currentMessageDescription.trim()) {
      this.errorMessage = 'Please enter a description for the message.';
      return;
    }

    const userId = 1; // Remplacez par l'ID de l'utilisateur connecté

    // Créer un FormData pour envoyer le message et l'image
    const formData = new FormData();
    formData.append('userId', '1'); // Remplacez par l'ID de l'utilisateur connecté
    formData.append('discussionId', this.discussionId.toString());
    formData.append('description', this.currentMessageDescription); // Utiliser currentMessageDescription
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.messageService.addMessageWithImage(formData).subscribe({
      next: (message) => {
        this.messages.push(message); // Ajouter le nouveau message à la liste
        this.filteredMessages = [...this.messages]; // Mettre à jour les messages filtrés
        this.updatePagination();
        this.currentMessageDescription = ''; // Réinitialiser le champ de saisie
        this.selectedImage = null; // Réinitialiser l'aperçu de l'image
        this.selectedFile = null; // Réinitialiser le fichier sélectionné
        this.errorMessage = '';

        // Fermer le formulaire après l'ajout réussi
        this.toggleForm();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du message';
      },
    });
  }

  // Méthode pour démarrer la modification d'un message
  editMessage(messageId: number, description: string, imageUrl: string): void {
    this.isEditMode = true; // Activer le mode édition
    this.editMessageId = messageId;
    this.currentMessageDescription = description; // Utiliser la propriété intermédiaire
    this.editSelectedImage = imageUrl ? 'http://localhost:8089/images/' + imageUrl : null; // Afficher l'image actuelle
    this.editSelectedFile = null; // Réinitialiser le fichier sélectionné
    this.showForm = true; // Ouvrir la sidebar
  }

  // Méthode pour sauvegarder les modifications d'un message
  saveMessage(): void {
    if (!this.currentMessageDescription.trim()) {
      this.errorMessage = 'Please enter a description for the message.';
      return;
    }

    if (this.editMessageId !== null) {
      const formData = new FormData();
      formData.append('description', this.currentMessageDescription); // Utiliser currentMessageDescription
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
          this.filteredMessages = [...this.messages]; // Mettre à jour les messages filtrés
          this.updatePagination();
          this.editMessageId = null; // Réinitialiser l'édition
          this.currentMessageDescription = ''; // Réinitialiser la description
          this.editSelectedImage = null;
          this.editSelectedFile = null;
          this.errorMessage = '';
          this.showForm = false; // Fermer la sidebar après la sauvegarde
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
          this.filteredMessages = [...this.messages]; // Mettre à jour les messages filtrés
          this.updatePagination();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du message';
        },
      });
    }
  }

  // Méthode pour gérer la sélection de fichier lors de l'ajout d'un message
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

  // Méthode pour filtrer les messages en fonction de la recherche
  onSearch(): void {
    if (this.searchQuery) {
      this.filteredMessages = this.messages.filter((message) =>
        message.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredMessages = [...this.messages];
    }
    this.currentPage = 1; // Réinitialiser la pagination
    this.updatePagination();
  }

  // Méthode pour mettre à jour la pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMessages.length / this.itemsPerPage);
  }

  // Méthode pour obtenir les messages paginés
  getPaginatedMessages(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMessages.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}