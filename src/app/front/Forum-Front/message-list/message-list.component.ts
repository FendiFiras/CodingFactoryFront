import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'src/app/service/message.service';
import { Message } from 'src/app/models/message.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']  ,
    imports: [CommonModule, SharedModule, NavbarComponent, FooterComponent,RouterModule]
  
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  discussionId!: number;
  isLoading = true;
  errorMessage = '';
  filteredMessages: Message[] = []; // Messages filtrés
  searchQuery = ''; // Requête de recherche
  currentUserId = 1; // Remplacez par l'ID de l'utilisateur actuel


  // Nouveau message
  newMessage = {
    userId: 1, // Remplacez par l'ID de l'utilisateur actuel
    discussionId: 0, // Sera mis à jour avec l'ID de la discussion
    description: '', // Utilisez description si c'est ce que l'API attend
    image: null as File | null, // Ajoutez cette ligne pour définir la propriété `image`
    anonymous: false // Option d'anonymat

  };
   // Message en cours d'édition
editingMessage: Message | null = null;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.discussionId = +params['discussionId'];
      this.newMessage.discussionId = this.discussionId;
      this.loadMessages();
    });
  }

  loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesForDiscussion(this.discussionId).subscribe({
      next: (data) => {
        this.messages = data;
        this.filteredMessages = data; // Initialiser les messages filtrés
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des messages';
        this.isLoading = false;
      }
    });
  }


  startEdit(message: Message): void {
    this.editingMessage = { ...message };
  }

  cancelEdit(): void {
    this.editingMessage = null;
  }

  updateMessage(): void {
    if (this.editingMessage) {
      this.messageService
        .updateMessage(this.editingMessage.message_id, this.editingMessage.description)
        .subscribe({
          next: () => {
            this.loadMessages();
            this.editingMessage = null;
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du message:', err);
          },
        });
    }
  }

  deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.messageService.deleteMessage(messageId).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du message:', err);
        },
      });
    }
  }




    // Filtrer les messages par date
    filterMessages(filter: 'today' | 'week'): void {
      const now = new Date();
      if (filter === 'today') {
        this.filteredMessages = this.messages.filter(message => {
          const messageDate = new Date(message.messageDate);
          return messageDate.toDateString() === now.toDateString();
        });
      } else if (filter === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        this.filteredMessages = this.messages.filter(message => {
          const messageDate = new Date(message.messageDate);
          return messageDate >= startOfWeek;
        });
      }
    }
  
    // Rechercher des messages
    searchMessages(): void {
      if (this.searchQuery) {
        this.filteredMessages = this.messages.filter(message =>
          message.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredMessages = this.messages;
      }
    }



    onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        this.newMessage.image = file; // Assign the selected file to the `image` property
      }
    }


    addMessage(): void {
      if (!this.newMessage.description && !this.newMessage.image) {
        alert('Veuillez entrer un message ou sélectionner une image.');
        return;
      }
  
      if (this.newMessage.image) {
        const formData = new FormData();
        formData.append('userId', this.newMessage.userId.toString());
        formData.append('discussionId', this.newMessage.discussionId.toString());
        formData.append('description', this.newMessage.description);
        formData.append('anonymous', this.newMessage.anonymous.toString());
        formData.append('image', this.newMessage.image);
  
        this.messageService.addMessageWithImage(formData, this.newMessage.anonymous).subscribe({
          next: (response) => {
            console.log('Réponse de l\'API :', response);
            this.newMessage.description = '';
            this.newMessage.image = null; // Reset the image property
            this.newMessage.anonymous = false; // Reset the anonymous property
            this.loadMessages();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout du message:', err);
          }
        });
      } else {
        this.messageService.addMessage(this.newMessage.userId, this.newMessage.discussionId, this.newMessage.description, this.newMessage.anonymous).subscribe({
          next: (response) => {
            console.log('Réponse de l\'API :', response);
            this.newMessage.description = '';
            this.newMessage.anonymous = false; // Reset the anonymous property
            this.loadMessages();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout du message:', err);
          }
        });
      }
    }
  }