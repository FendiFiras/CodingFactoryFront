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
    description: '' // Utilisez description si c'est ce que l'API attend
  };

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

  addMessage(): void {
    if (!this.newMessage.description) {
      alert('Veuillez entrer un message.');
      return;
    }
  
    this.messageService.addMessage(this.newMessage.userId, this.newMessage.discussionId, this.newMessage.description)
      .subscribe({
        next: (response) => {
          console.log('Réponse de l\'API :', response); // Log de la réponse de l'API
          this.newMessage.description = '';
          this.loadMessages();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du message:', err);
        }
      });
  }
}