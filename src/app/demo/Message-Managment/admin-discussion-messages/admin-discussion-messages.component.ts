import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-admin-discussion-messages',
  templateUrl: './admin-discussion-messages.component.html',
  styleUrls: ['./admin-discussion-messages.component.scss'],
  imports: [CommonModule, FormsModule], // ✅ Importez CommonModule ici

})
export class AdminDiscussionMessagesComponent implements OnInit {
  navMobClick() {
    throw new Error('Method not implemented.');
  }
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
  // Ajouter un message
  addMessage(): void {
    if (!this.newMessageDescription.trim()) {
      this.errorMessage = 'Veuillez entrer une description pour le message.';
      return;
    }

    const userId = 1; // Remplacez par l'ID de l'utilisateur connecté
    this.messageService.addMessage(userId, this.discussionId, this.newMessageDescription).subscribe({
      next: (message) => {
        this.messages.push(message); // Ajouter le nouveau message à la liste
        this.newMessageDescription = ''; // Réinitialiser le champ de saisie
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout du message';
      },
    });
  }

  // Modifier un message
  editMessage(messageId: number, description: string): void {
    this.editMessageId = messageId;
    this.editMessageDescription = description;
  }

  // Sauvegarder les modifications d'un message
  saveMessage(): void {
    if (!this.editMessageDescription.trim()) {
      this.errorMessage = 'Veuillez entrer une description pour le message.';
      return;
    }

    if (this.editMessageId !== null) {
      this.messageService.updateMessage(this.editMessageId, this.editMessageDescription).subscribe({
        next: (message) => {
          const index = this.messages.findIndex((m) => m.message_id === this.editMessageId);
          if (index !== -1) {
            this.messages[index].description = message.description; // Mettre à jour la description
          }
          this.editMessageId = null; // Réinitialiser l'édition
          this.editMessageDescription = '';
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