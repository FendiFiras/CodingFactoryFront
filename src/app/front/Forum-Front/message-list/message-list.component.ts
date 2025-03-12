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
  styleUrls: ['./message-list.component.scss'],
  imports: [CommonModule, SharedModule, NavbarComponent, FooterComponent, RouterModule]
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  discussionId!: number;
  isLoading = true;
  errorMessage = '';
  filteredMessages: Message[] = [];
  searchQuery = '';
  currentUserId = 1; // Remplacez par l'ID de l'utilisateur actuel
  currentUserName: string = 'zitouni'; // Nom de l'utilisateur actuel
  currentUserImage: string = 'assets/images/zita.jpg';
  isLocationEnabled = false;
  currentLocation: { latitude: number, longitude: number } | null = null;



  // Liste des mots interdits
  badWords: string[] = [
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'crap', 
    'dick', 'piss', 'cock', 'cunt', 'slut', 'whore', 'motherfucker', 
    'nigger', 'nigga', 'faggot', 'retard', 'prick', 'twat', 'wanker'
  ];
  
  // Nouveau message
  newMessage = {
    userId: 1, // Remplacez par l'ID de l'utilisateur actuel
    discussionId: 0,
    description: '',
    image: null as File | null,
    anonymous: false
  };

  // Message en cours d'édition
  editingMessage: Message | null = null;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute  , 

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.discussionId = +params['discussionId'];
      this.newMessage.discussionId = this.discussionId;
      this.loadMessages();
    });
  
    // Demander la permission de géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => console.log('Permission de géolocalisation accordée'),
        (error) => console.error('Permission de géolocalisation refusée:', error)
      );
    }
  }

  // Filtrer les mots interdits
  filterBadWords(text: string): string {
    let filteredText = text;
    this.badWords.forEach((word) => {
      const regex = new RegExp(word, 'gi'); // Recherche insensible à la casse
      filteredText = filteredText.replace(regex, '**');
    });
    return filteredText;
  }

  loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesForDiscussion(this.discussionId).subscribe({
      next: (data) => {
        this.messages = data.map(message => ({
          ...message,
          description: this.filterBadWords(message.description),
          likes: this.getStoredLikes(message.message_id),
          dislikes: this.getStoredDislikes(message.message_id)
        }));
        this.filteredMessages = this.messages;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des messages';
        this.isLoading = false;
      }
    });
}

getStoredLikes(messageId: number): number {
  const likedMessages = JSON.parse(localStorage.getItem('likedMessages') || '[]');
  return likedMessages.includes(messageId) ? 1 : 0; // Retourne 1 si liké, sinon 0
}

getStoredDislikes(messageId: number): number {
  const dislikedMessages = JSON.parse(localStorage.getItem('dislikedMessages') || '[]');
  return dislikedMessages.includes(messageId) ? 1 : 0; // Retourne 1 si disliké, sinon 0
}


  startEdit(message: Message): void {
    this.editingMessage = { ...message };
  }

  cancelEdit(): void {
    this.editingMessage = null;
  }
  toggleLike(message: any) {
    let likedMessages = JSON.parse(localStorage.getItem('likedMessages') || '[]');
  
    if (likedMessages.includes(message.message_id)) {
      // Déjà liké → On l'enlève
      likedMessages = likedMessages.filter(id => id !== message.message_id);
      message.likes = Math.max(0, message.likes - 1);
    } else {
      // Ajouter le like et supprimer le dislike s'il y en a un
      likedMessages.push(message.message_id);
      message.likes++;
  
      this.removeDislike(message.message_id); // Retirer le dislike si présent
    }
  
    localStorage.setItem('likedMessages', JSON.stringify(likedMessages));
  }
  
  toggleDislike(message: any) {
    let dislikedMessages = JSON.parse(localStorage.getItem('dislikedMessages') || '[]');
  
    if (dislikedMessages.includes(message.message_id)) {
      // Déjà disliké → On l'enlève
      dislikedMessages = dislikedMessages.filter(id => id !== message.message_id);
      message.dislikes = Math.max(0, message.dislikes - 1);
    } else {
      // Ajouter le dislike et supprimer le like s'il y en a un
      dislikedMessages.push(message.message_id);
      message.dislikes++;
  
      this.removeLike(message.message_id); // Retirer le like si présent
    }
  
    localStorage.setItem('dislikedMessages', JSON.stringify(dislikedMessages));
  }
  
  // Vérifie si un message est liké
  isLiked(messageId: number): boolean {
    const likedMessages = JSON.parse(localStorage.getItem('likedMessages') || '[]');
    return likedMessages.includes(messageId);
  }
  
  // Vérifie si un message est disliké
  isDisliked(messageId: number): boolean {
    const dislikedMessages = JSON.parse(localStorage.getItem('dislikedMessages') || '[]');
    return dislikedMessages.includes(messageId);
  }
  
  // Supprime un like (quand on met un dislike)
  removeLike(messageId: number) {
    let likedMessages = JSON.parse(localStorage.getItem('likedMessages') || '[]');
    likedMessages = likedMessages.filter(id => id !== messageId);
    localStorage.setItem('likedMessages', JSON.stringify(likedMessages));
  }
  
  // Supprime un dislike (quand on met un like)
  removeDislike(messageId: number) {
    let dislikedMessages = JSON.parse(localStorage.getItem('dislikedMessages') || '[]');
    dislikedMessages = dislikedMessages.filter(id => id !== messageId);
    localStorage.setItem('dislikedMessages', JSON.stringify(dislikedMessages));
  }
  
  
  
  updateMessage(): void {
    if (this.editingMessage) {
      this.editingMessage.description = this.filterBadWords(this.editingMessage.description);
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
      this.newMessage.image = file;
    }
  }

  // Méthode pour envoyer le message
  async addMessage(): Promise<void> {
    try {
      this.newMessage.description = this.filterBadWords(this.newMessage.description);
  
      if (!this.newMessage.description.trim() && !this.newMessage.image) {
        alert('Veuillez entrer un message ou sélectionner une image.');
        return;
      }
  
      // Récupérer la localisation uniquement si elle est activée
      const latitude = this.isLocationEnabled ? this.currentLocation?.latitude : null;
      const longitude = this.isLocationEnabled ? this.currentLocation?.longitude : null;
  
      console.log('Envoi de la localisation :', { latitude, longitude }); // Log des valeurs envoyées
  
      if (this.newMessage.image) {
        const formData = new FormData();
        formData.append('userId', this.newMessage.userId.toString());
        formData.append('discussionId', this.newMessage.discussionId.toString());
        formData.append('description', this.newMessage.description);
        formData.append('anonymous', this.newMessage.anonymous.toString());
        if (latitude !== null && longitude !== null) {
          formData.append('latitude', latitude.toString());
          formData.append('longitude', longitude.toString());
        }
        formData.append('image', this.newMessage.image);
  
        this.messageService.addMessageWithImage(formData).subscribe({
          next: () => {
            this.resetMessageForm();
            this.loadMessages();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout du message:', err);
          }
        });
      } else {
        this.messageService.addMessageWithLocation(
          this.newMessage.userId,
          this.newMessage.discussionId,
          this.newMessage.description,
          latitude,
          longitude,
          this.newMessage.anonymous
        ).subscribe({
          next: () => {
            this.resetMessageForm();
            this.loadMessages();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout du message:', err);
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
    }
  }

  // Réinitialiser le formulaire de message
  resetMessageForm(): void {
    this.newMessage.description = '';
    this.newMessage.image = null;
    this.newMessage.anonymous = false;
    this.isLocationEnabled = false;
    this.currentLocation = null;
  }



  // Méthode pour récupérer la localisation
  getCurrentLocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true, // Active la haute précision
            timeout: 10000, // Temps d'attente maximum (10 secondes)
            maximumAge: 0 // Ne pas utiliser de cache
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }


  async requestLocationPermission(): Promise<boolean> {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      return permissionStatus.state === 'granted';
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }

  // Méthode pour activer/désactiver la localisation
  async toggleLocation() {
    this.isLocationEnabled = !this.isLocationEnabled;
    if (this.isLocationEnabled) {
      try {
        this.currentLocation = await this.getCurrentLocation();
        console.log('Localisation activée :', this.currentLocation);
      } catch (error) {
        console.error('Erreur lors de la récupération de la localisation:', error);
        alert('Impossible de récupérer votre localisation. Veuillez vérifier les permissions de géolocalisation.');
        this.isLocationEnabled = false; // Désactiver la localisation en cas d'erreur
      }
    } else {
      this.currentLocation = null; // Réinitialiser la localisation
    }
  }
}