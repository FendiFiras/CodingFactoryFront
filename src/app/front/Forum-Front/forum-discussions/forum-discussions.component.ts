import { Component, NgModule, OnInit } from '@angular/core';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { Discussion } from 'src/app/models/discussion1';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { FooterComponent } from "../../elements/footer/footer.component";
import { FormsModule, NgModel } from '@angular/forms';



@Component({
  selector: 'app-forum-discussions',
  templateUrl: './forum-discussions.component.html',
  styleUrls: ['./forum-discussions.component.scss'],
  imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule,]
})
export class ForumDiscussionsComponent implements OnInit {
  discussions: Discussion[] = [];
  isLoading = true;
  showForm = false; // Variable pour afficher/masquer le formulaire
  errorMessage = '';
  forumId!: number; // ID du forum
  newDiscussion = { title: '', description: '', numberOfLikes: 0, publicationDate: '' };


  constructor(
    private discussionService: DiscussionService,
    private route: ActivatedRoute // Injectez ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérez le paramètre forumId de l'URL
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId']; // Convertir en nombre
      this.loadDiscussions(); // Load discussions for the forum
    });
  }

  // Load discussions for the forum
  loadDiscussions(): void {
    this.isLoading = true;
    this.discussionService.getDiscussionsByForum(this.forumId).subscribe({
      next: (data) => {
        this.discussions = data; // Store the fetched discussions
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading discussions';
        this.isLoading = false;
      }
    });
  }

  // Ajouter une nouvelle discussion
  addDiscussion(): void {
    if (!this.newDiscussion.title || !this.newDiscussion.description) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.newDiscussion.publicationDate = new Date().toISOString();

    this.discussionService.addDiscussionToForum(this.newDiscussion, 1, this.forumId) // Remplace 1 par l'ID utilisateur si dispo
      .subscribe({
        next: (response) => {
          console.log('Discussion ajoutée:', response);
          this.showForm = false; // Cacher le formulaire après ajout
          this.newDiscussion = { title: '', description: '', numberOfLikes: 0, publicationDate: '' }; // Réinitialiser le formulaire
          this.loadDiscussions(); 
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la discussion:', err);
        }
      });
  }
  
  // Supprimer une discussion
  deleteDiscussion(discussionId: number): void {
    if (confirm('Are you sure you want to delete this discussion?')) {
      this.discussionService.deleteDiscussion(discussionId).subscribe({
        next: () => {
          this.discussions = this.discussions.filter(d => d.id !== discussionId); // Supprime la discussion de la liste
        },
        error: () => {
          this.errorMessage = 'Error deleting discussion';
        }
      });
    }
  }
}