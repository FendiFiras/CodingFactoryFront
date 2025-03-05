import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, FormsModule } from '@angular/forms';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from 'src/app/theme/layout/admin/navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from 'src/app/theme/shared/components/breadcrumbs/breadcrumbs.component';
import { Discussion } from 'src/app/models/discussion1';

@Component({
  selector: 'app-admin-add-discussion',
  templateUrl: './admin-forum-discussions.component.html',
  styleUrls: ['./admin-forum-discussions.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NavigationComponent, RouterModule, ConfigurationComponent, FormsModule],
})
export class AdminDiscussionComponent implements OnInit {
  navMobClick() {
    throw new Error('Method not implemented.');
  }
  addDiscussionForm: FormGroup;
  forumId!: number;
  editMode = false;
  discussion_id?: number;
  errorMessage: string = '';
  discussions: any[] = [];
  isLoading: boolean = false;
  showForm: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 6; // Nombre d'éléments par page
  searchQuery: string = ''; // Propriété pour la recherche
  filteredDiscussions: any[] = []; // Liste filtrée des discussions

  // Propriétés pour la navigation
  navCollapsed = false;
  navCollapsedMob = false;

  constructor(
    private fb: FormBuilder,
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {

     // Simule un ID utilisateur connecté (remplacez par votre logique)
  const userId = 2; // Remplacez par votre vrai ID utilisateur

    // Initialisation du formulaire avec des validateurs
    this.addDiscussionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100), 
        this.forbiddenCharactersValidator(/[!@#$%^&*(),.?":{}|<>]/), 
        this.noWhitespaceValidator(), this.noAllCapsValidator()]],
      description: ['', [Validators.required, Validators.maxLength(500), 
        this.forbiddenWordsValidator(['motInterdit1', 'motInterdit2']), 
        this.noWhitespaceValidator(), this.noAllCapsValidator()]],
      userId: [userId, Validators.required] // ✅ Assigne directement l'ID utilisateur
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      const discussion_id = params['discussion_id'];
      console.log('Forum ID:', this.forumId);
      console.log('Discussion ID:', discussion_id);

      if (discussion_id) {
        this.editMode = true;
        this.discussion_id = +discussion_id;
        this.loadDiscussion(this.discussion_id);
        this.showForm = true;
      } else {
        this.loadDiscussions();
      }
    });
  }

  // Validateur personnalisé pour les caractères interdits
  forbiddenCharactersValidator(forbiddenChars: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = forbiddenChars.test(control.value);
      return forbidden ? { forbiddenCharacters: { value: control.value } } : null;
    };
  }

  // Validateur personnalisé pour les mots interdits
  forbiddenWordsValidator(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value; // Récupérez la valeur du champ
    if (!value) { // Si la valeur est null, undefined ou une chaîne vide
      return null; // Ne pas valider, car il n'y a rien à vérifier
    }
      const forbidden = forbiddenWords.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
      return forbidden ? { forbiddenWords: { value: control.value } } : null;
    };
  }

  // Validateur pour les espaces superflus
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  // Validateur pour les mots en majuscules
  noAllCapsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      const isAllCaps = value === value.toUpperCase();
      return isAllCaps ? { allCaps: true } : null;
    };
  }

  // Basculer l'affichage du formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editMode = false;
      this.discussion_id = undefined;
      this.addDiscussionForm.reset();
      this.addDiscussionForm.patchValue({ userId: 2 }); // Re-set the userId if needed

    }
  }

  // Charger toutes les discussions du forum
  loadDiscussions(): void {
    this.isLoading = true;
    this.discussionService.getDiscussionsByForum(this.forumId).subscribe({
      next: (data) => {
        console.log("Discussions chargées :", data);
        this.discussions = data;
        this.filteredDiscussions = data; // Initialiser filteredDiscussions avec les données chargées
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des discussions';
        this.isLoading = false;
      },
    });
  }
  

  // Charger une discussion spécifique
  loadDiscussion(discussion_id: number): void {
    this.discussionService.getDiscussionById(this.forumId, discussion_id).subscribe({
      next: (data) => {
        this.addDiscussionForm.patchValue({
          title: data.title,
          description: data.description,
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la discussion', err);
      },
    });
  }

  // Supprimer une discussion
  deleteDiscussion(discussion_id: number): void {
    console.log("ID de la discussion avant suppression:", discussion_id); // Vérification de l'ID
    if (!discussion_id || discussion_id === undefined) {
      this.errorMessage = 'ID de la discussion invalide';
      return;
    }
    this.discussionService.deleteDiscussion(discussion_id).subscribe({
      next: () => {
        // Met à jour la liste des discussions localement avant de recharger
        this.discussions = this.discussions.filter(d => d.discussion_id !== discussion_id);
        // Force la détection des changements après la mise à jour
        this.cdRef.detectChanges();
  
        // Recharge les discussions après la suppression
        console.log("Rechargement des discussions...");
        this.loadDiscussions();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression de la discussion';
      },
    });
  }
  
  

  // Modifier une discussion
  editDiscussion(discussion: any): void {
    console.log("Discussion sélectionnée :", discussion);
    if (!discussion || !discussion.discussion_id) {
      console.error("ERREUR : Discussion ou ID de la discussion est undefined !");
      return;
    }
  
    this.editMode = true;
    this.discussion_id = discussion.discussion_id;
    console.log("ID de la discussion à modifier :", this.discussion_id);
  
    this.addDiscussionForm.patchValue({
      title: discussion.title,
      description: discussion.description,
    });
  
    this.showForm = true;
  }
  

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.addDiscussionForm.invalid) {
      return;
    }
  
    const formValues = this.addDiscussionForm.value;
    console.log('Form Values:', formValues); // Log form values
  
    const discussion: Discussion = {
      title: formValues.title,
      description: formValues.description,
      numberOfLikes: 0, // Default value
      publicationDate: new Date().toISOString() // Default value
    };
  
    console.log('Payload being sent:', discussion); // Log the payload
  
    if (this.editMode && this.discussion_id) {
      discussion.discussion_id = this.discussion_id;
      this.discussionService.updateDiscussion(this.discussion_id, discussion).subscribe({
        next: () => {
          this.toggleForm();
          this.loadDiscussions();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la discussion', err);
          if (err.error) {
            console.error('Détails de l\'erreur:', err.error);
          }
        },
      });
    } else {
      this.discussionService.addDiscussionToForum(discussion, formValues.userId, this.forumId).subscribe({
        next: () => {
          this.toggleForm();
          this.loadDiscussions();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la discussion', err);
          if (err.error) {
            console.error('Détails de l\'erreur:', err.error);
          }
        },
      });
    }
  }

        // Méthode pour naviguer vers la page des messages d'une discussion
        viewMessages(discussion_id: number): void {
          console.log('Navigating to messages for discussion ID:', discussion_id);
          this.router.navigate([`/admin/forum/${this.forumId}/discussion/${discussion_id}/messages`]);
        }

        // Méthode pour filtrer les discussions en fonction de la recherche
  applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredDiscussions = this.discussions; // Si la recherche est vide, afficher toutes les discussions
    } else {
      this.filteredDiscussions = this.discussions.filter(
        (discussion) =>
          discussion.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          discussion.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.currentPage = 1; // Réinitialiser la pagination à la première page
  }

  // Méthode pour obtenir les discussions paginées
  get paginatedDiscussions(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDiscussions.slice(startIndex, endIndex);
  }

  // Méthode pour obtenir le nombre total de pages
  getTotalPages(): number {
    return Math.ceil(this.filteredDiscussions.length / this.itemsPerPage);
  }

  // Méthode pour obtenir la liste des pages
  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Méthode pour aller à une page spécifique
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  // Méthode pour aller à la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Méthode pour aller à la page suivante
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}