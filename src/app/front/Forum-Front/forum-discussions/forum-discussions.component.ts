import { Component, NgModule, OnInit } from '@angular/core';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { Discussion } from 'src/app/models/discussion1';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forum-discussions',
  templateUrl: './forum-discussions.component.html',
  styleUrls: ['./forum-discussions.component.scss'],
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule]
})
export class ForumDiscussionsComponent implements OnInit {
  discussions: Discussion[] = [];
  isLoading = true;
  showForm = false;
  errorMessage = '';
  forumId!: number;
  newDiscussion = {  discussion_id: 0,  
    title: '', description: '', numberOfLikes: 0, publicationDate: '' };
  selectedDiscussion: Discussion | null = null;
  editingDiscussionId: number | null = null; // Pour suivre la discussion en cours d'édition

  constructor(
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      this.loadDiscussions();
    });
  }

  loadDiscussions(): void {
    this.isLoading = true;
    this.discussionService.getDiscussionsByForum(this.forumId).subscribe({
      next: (data) => {
        this.discussions = data; // Utilisez discussion_id directement
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des discussions';
        this.isLoading = false;
      }
    });
  }

  navigateToMessages(discussionId: number): void {
    console.log('Navigating to messages for discussion ID:', discussionId);
    this.router.navigate(['/discussion', discussionId, 'messages']);
  }

  addDiscussion(): void {
    if (!this.newDiscussion.title || !this.newDiscussion.description) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.newDiscussion.publicationDate = new Date().toISOString();

    this.discussionService.addDiscussionToForum(this.newDiscussion, 1, this.forumId)
      .subscribe({
        next: (response) => {
          console.log('Discussion ajoutée:', response);
          this.showForm = false;
          this.newDiscussion = {   discussion_id: 0, // Optionnel, selon les besoins de l'API
            title: '', description: '', numberOfLikes: 0, publicationDate: '' };
          this.loadDiscussions();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la discussion:', err);
        }
      });
  }

  deleteDiscussion(discussionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) {
      this.discussionService.deleteDiscussion(discussionId).subscribe({
        next: (response) => {
          this.discussions = this.discussions.filter(d => d.discussion_id !== discussionId); // Mettre à jour la liste locale
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la discussion:', error);
          if (error.status === 404) {
            this.errorMessage = error.error.error; // Afficher le message d'erreur du serveur
          } else {
            this.errorMessage = 'Erreur lors de la suppression de la discussion';
          }
        },
      });
    }
  }
  selectDiscussionForUpdate(discussion: Discussion): void {
    this.selectedDiscussion = { ...discussion };
  }
   // Méthode pour vérifier si une discussion est en mode édition
   isEditing(discussionId: number): boolean {
    return this.editingDiscussionId === discussionId;
}

// Méthode pour démarrer l'édition d'une discussion
startEditing(discussion: any): void {
    this.editingDiscussionId = discussion.discussion_id;
}

// Méthode pour annuler l'édition
cancelEditing(discussionId: number): void {
    this.editingDiscussionId = null;
}


  updateDiscussion(): void {
    if (this.selectedDiscussion) {
      this.discussionService.updateDiscussion(this.selectedDiscussion.discussion_id, this.selectedDiscussion)
        .subscribe({
          next: (updatedDiscussion) => {
            console.log('Discussion mise à jour:', updatedDiscussion);
            const index = this.discussions.findIndex(d => d.discussion_id === updatedDiscussion.discussion_id); // Utilisez discussion_id
            if (index !== -1) {
              this.discussions[index] = updatedDiscussion;
            }
            this.selectedDiscussion = null;
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la discussion:', err);
            this.errorMessage = 'Erreur lors de la mise à jour de la discussion';
          }
        });
    }
  }
}