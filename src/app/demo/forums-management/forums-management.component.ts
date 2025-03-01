import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ForumService } from 'src/app/service/forum.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationComponent } from "../../theme/layout/admin/configuration/configuration.component";

interface Forum {
  forum_id?: number;
  title: string;
  description: string;
  image?: string;
  creationDate?: Date;
  
}

@Component({
  selector: 'app-forums-management',
  templateUrl: './forums-management.component.html',
  styleUrls: ['./forums-management.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, ConfigurationComponent],
})
export class ForumsManagementComponent implements OnInit {
  forums: Forum[] = [];
  isLoading = true;
  errorMessage = '';
  addForumForm: FormGroup;
  forumToEdit: Forum | null = null;
  showAddForm: boolean = false; // Contrôle l'affichage de la sidebar
  editMode: boolean = false; // Contrôle le mode édition

  constructor(
    private forumService: ForumService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, // Injecter ChangeDetectorRef
  ) 
  
  
  {
    this.addForumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required], // Ajout de la validation pour l'image si nécessaire
    });
  }

  ngOnInit(): void {
    this.loadForums();
  }

  // Méthode pour basculer l'affichage de la sidebar
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.editMode = false; // Réinitialiser le mode édition
      this.addForumForm.reset(); // Réinitialiser le formulaire
    }
  }

  // Charge les forums
  loadForums(): void {
    this.isLoading = true;
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        this.forums = data;
        console.log('Forums chargés :', this.forums);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.errorMessage = 'Erreur lors du chargement des forums';
        this.isLoading = false;
      },
    });
  }

  // Ajout d'un forum avec FormData
  addForum(): void {
    if (this.addForumForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.addForumForm.value.title);
    formData.append('description', this.addForumForm.value.description);
    formData.append('userId','2'); // Ajouter userId





    if (this.addForumForm.value.image) {
      formData.append('image', this.addForumForm.value.image);
    }

    this.forumService.addForum(formData).subscribe({
      next: (newForum) => {
        this.forums.push(newForum);
        this.addForumForm.reset();
        this.showAddForm = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du forum :", err);
        this.errorMessage = err.error?.message || "Erreur lors de l'ajout du forum. Veuillez réessayer.";
      },
    });
  }

  // Sélection d’un fichier image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.addForumForm.patchValue({ image: file });
      this.addForumForm.get('image')?.updateValueAndValidity(); // Mettre à jour la validation
    }
  }

  // Navigation vers les discussions d'un forum
  navigateToDiscussions(forumId: number): void {
    console.log('Navigating to discussions for forum ID:', forumId);  // Debugging line
    this.router.navigate([`/admin/forum/${forumId}/discussions`]);
  }

  // Édition d'un forum
  editForum(forum: Forum): void {
    this.editMode = true;
    this.forumToEdit = { ...forum }; // Conserver l'objet forum à modifier
    this.showAddForm = true;
    this.addForumForm.patchValue({
      forum_id: forum.forum_id, // Ajouter forum_id au formulaire
      title: forum.title,
      description: forum.description,
      image: null, // Réinitialiser l'image pour éviter les conflits
    });
  
    // Supprimer la validation de userId en mode édition
    if (this.editMode) {
      this.addForumForm.get('userId')?.clearValidators();
      this.addForumForm.get('userId')?.updateValueAndValidity();
    }
  }

  // Mise à jour d'un forum
  updateForum(): void {
    if (!this.forumToEdit) return;
  
    const { title, description, image } = this.addForumForm.value;
    const formData = new FormData();
    formData.append('forum_id', this.forumToEdit.forum_id!.toString()); // Inclure forum_id
    formData.append('title', title);
    formData.append('description', description);
  
    if (image) {
      formData.append('image', image);
    }
  
    this.forumService.updateForum(this.forumToEdit.forum_id!, formData).subscribe({
      next: (updatedForum) => {
        console.log('Réponse du serveur :', updatedForum);
  
        // Mettre à jour la liste des forums sans recharger la page
        this.forums = this.forums.map((forum) =>
          forum.forum_id === this.forumToEdit!.forum_id ? { ...forum, ...updatedForum } : forum
        );
  
        this.cdr.detectChanges(); // Forcer la mise à jour de l'affichage
  
        console.log('Forum mis à jour :', updatedForum);
        this.editMode = false;
        this.forumToEdit = null;
        this.addForumForm.reset();
        this.showAddForm = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du forum :', err);
        this.errorMessage = 'Erreur lors de la mise à jour du forum. Veuillez réessayer.';
      },
    });
  }

  // Suppression d'un forum
  confirmDelete(forumId: number | undefined): void {
    if (forumId === undefined || forumId === null) {
      this.errorMessage = 'ID forum invalide.';
      return;
    }

    if (confirm('Voulez-vous vraiment supprimer ce forum ?')) {
      this.forumService.deleteForum(forumId).subscribe({
        next: (response) => {
          console.log('Réponse API après suppression :', response);

          // Mettre à jour la liste des forums en supprimant le forum supprimé
          this.forums = this.forums.filter((forum) => forum.forum_id !== forumId);
          this.cdr.detectChanges();

          console.log('Forum supprimé :', forumId);
          this.errorMessage = '';
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du forum :', err);
          this.errorMessage = 'Erreur lors de la suppression du forum. Veuillez réessayer.';
        },
      });
    }
  }

  // Gestion de la soumission du formulaire
  onSubmit(): void {
    if (this.addForumForm.invalid) {
      alert('Veuillez corriger les erreurs du formulaire.');

      console.log('Formulaire invalide', this.addForumForm.value);
      return;
    }
  
    if (this.editMode && this.forumToEdit) {
      // Mode édition : mettre à jour le forum existant
      this.updateForum();
    } else {
      // Mode ajout : créer un nouveau forum
      this.addForum();
    }
  }
}