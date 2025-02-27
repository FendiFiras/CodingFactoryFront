import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-add-discussion',
  templateUrl: './admin-forum-discussions.component.html',
  styleUrls: ['./admin-forum-discussions.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NavigationComponent, RouterModule, ConfigurationComponent],


})
export class AdminDiscussionComponent implements OnInit {
navMobClick() {
throw new Error('Method not implemented.');
}
  addDiscussionForm: FormGroup;
  forumId!: number;
  editMode = false;
  discussionId?: number;
  errorMessage: string = '';  // Définir cette propriété
  discussions: any[] = [];  // Pour stocker la liste des discussions
  isLoading: boolean = false;  // Ajouter la propriété isLoading
  showForm: boolean = false; // Ajouter cette propriété

  // Ajoutez ces propriétés pour gérer la navigation
  navCollapsed = false; // État de la barre de navigation (réduite ou non)
  navCollapsedMob = false; // État de la barre de navigation sur mobile


  constructor(
    private fb: FormBuilder,
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.addDiscussionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      const discussionId = params['discussionId'];
      console.log('Forum ID:', this.forumId); // Vérifiez le forumId
      console.log('Discussion ID:', discussionId); // Vérifiez le discussionId
  
      if (discussionId) {
        this.editMode = true;
        this.discussionId = +discussionId;
        this.loadDiscussion(this.discussionId);
        this.showForm = true;
      } else {
        this.loadDiscussions();
      }
    });
  }

    // Méthode pour basculer l'affichage du formulaire
    toggleForm(): void {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.editMode = false; // Réinitialiser le mode édition
        this.addDiscussionForm.reset(); // Réinitialiser le formulaire
      }
    }
  

   // Charger toutes les discussions du forum
   loadDiscussions(): void {
    this.isLoading = true;  // Activer l'indicateur de chargement
    this.discussionService.getDiscussionsByForum(this.forumId).subscribe({
      next: (data) => {
        console.log("Discussions chargées :", data); // Debug

        this.discussions = data;
        this.isLoading = false;  // Désactiver l'indicateur de chargement une fois les données chargées
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des discussions';
        this.isLoading = false;  // Désactiver l'indicateur de chargement en cas d'erreur
      }
    });
  }
  
  loadDiscussion(discussionId: number): void {
    this.discussionService.getDiscussionById(this.forumId, discussionId).subscribe({
      next: (data) => {
        this.addDiscussionForm.patchValue({
          title: data.title,
          description: data.description,
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la discussion', err);
      }
    });
  }
  

  deleteDiscussion(discussionId: number): void {
    console.log("ID de la discussion :", discussionId);  // Affiche l'ID dans la console
    if (!discussionId || discussionId === undefined) {
      this.errorMessage = 'ID de la discussion invalide';
      return;
    }
    this.discussionService.deleteDiscussion(discussionId).subscribe({
      next: () => {
        this.loadDiscussions();  // Recharge la liste des discussions après la suppression
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression de la discussion';
      }
    });
  }


  editDiscussion(discussion: any): void {
    // Pour naviguer vers une discussion spécifique
this.router.navigate(['/admin/forum', this.forumId, 'discussions', this.discussionId]);

// Pour naviguer vers la liste des discussions (sans discussionId)
this.router.navigate(['/admin/forum', this.forumId, 'discussions']);
    console.log("Discussion sélectionnée :", discussion); // Vérifie l'objet reçu
    this.editMode = true;
    this.discussionId = discussion.id;
  
    console.log("ID de la discussion à modifier :", this.discussionId); // Vérifie si l'ID est défini
  
    if (!this.discussionId) {
      console.error("ERREUR : ID de la discussion est undefined !");
      return;
    }
    this.addDiscussionForm.patchValue({
      title: discussion.title,
      description: discussion.description,
    });
    this.showForm = true;
  }
  

  
    

  onSubmit(): void {
    if (this.addDiscussionForm.invalid) {
      return;
    }
  
    const formValues = this.addDiscussionForm.value;
  
    if (this.editMode && this.discussionId) {
      const updatedDiscussion = { id: this.discussionId, ...formValues };
      console.log("Données envoyées à updateDiscussion:", updatedDiscussion); // Debug
  
      // Pass both discussion_id and discussion to the service
      this.discussionService.updateDiscussion(this.discussionId, updatedDiscussion).subscribe({
        next: () => {
          this.toggleForm(); 
          this.loadDiscussions();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la discussion', err);
        }
      });
    } else {
      console.error("Erreur : discussionId est undefined !");
    }
  }
  
}
