import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
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
  errorMessage: string = '';
  discussions: any[] = [];
  isLoading: boolean = false;
  showForm: boolean = false;

  // Propriétés pour la navigation
  navCollapsed = false;
  navCollapsedMob = false;

  constructor(
    private fb: FormBuilder,
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // Initialisation du formulaire avec des validateurs
    this.addDiscussionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), this.forbiddenCharactersValidator(/[!@#$%^&*(),.?":{}|<>]/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), this.forbiddenWordsValidator(['motInterdit1', 'motInterdit2'])]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      const discussionId = params['discussionId'];
      console.log('Forum ID:', this.forumId);
      console.log('Discussion ID:', discussionId);

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
      const forbidden = forbiddenWords.some(word => control.value.includes(word));
      return forbidden ? { forbiddenWords: { value: control.value } } : null;
    };
  }

  // Basculer l'affichage du formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editMode = false;
      this.discussionId = undefined;
      this.addDiscussionForm.reset();
    }
  }

  // Charger toutes les discussions du forum
  loadDiscussions(): void {
    this.isLoading = true;
    this.discussionService.getDiscussionsByForum(this.forumId).subscribe({
      next: (data) => {
        console.log("Discussions chargées :", data);
        this.discussions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des discussions';
        this.isLoading = false;
      },
    });
  }

  // Charger une discussion spécifique
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
      },
    });
  }

  // Supprimer une discussion
  deleteDiscussion(discussionId: number): void {
    console.log("ID de la discussion :", discussionId);
    if (!discussionId || discussionId === undefined) {
      this.errorMessage = 'ID de la discussion invalide';
      return;
    }
    this.discussionService.deleteDiscussion(discussionId).subscribe({
      next: () => {
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
    if (!discussion || !discussion.id) {
      console.error("ERREUR : Discussion ou ID de la discussion est undefined !");
      return;
    }

    this.editMode = true;
    this.discussionId = discussion.id;
    console.log("ID de la discussion à modifier :", this.discussionId);

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

    if (this.editMode && this.discussionId) {
      // Mode édition
      const updatedDiscussion = { id: this.discussionId, ...formValues };
      console.log("Données envoyées à updateDiscussion:", updatedDiscussion);

      this.discussionService.updateDiscussion(this.discussionId, updatedDiscussion).subscribe({
        next: () => {
          this.toggleForm();
          this.loadDiscussions();
          this.router.navigate(['/admin/forum', this.forumId, 'discussions']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la discussion', err);
        },
      });
    } else {
      // Mode ajout
      const userId = 1; // Remplacez par la vraie valeur de l'utilisateur
      this.discussionService.addDiscussionToForum(formValues, userId, this.forumId).subscribe({
        next: () => {
          this.toggleForm();
          this.loadDiscussions();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la discussion', err);
        },
      });
    }
  }
}