import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ForumService } from 'src/app/service/forum.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

// Fonction de validation personnalisée pour le titre
function titleValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  const regex = /^[a-zA-Z\s]{2,}$/; // Au moins 2 caractères alphabétiques
  if (!regex.test(value)) {
    return { 'invalidTitle': true };
  }
  return null;
}

// Fonction de validation personnalisée pour la description
function descriptionValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (value.length < 10 || value.length > 100) {
    return { 'invalidDescription': true };
  }
  return null;
}

@Component({
  selector: 'app-forums-management',
  templateUrl: './forums-management.component.html',
  styleUrls: ['./forums-management.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, ConfigurationComponent, FormsModule],
})
export class ForumsManagementComponent implements OnInit {
  forums: Forum[] = [];
  filteredForums: Forum[] = []; // Nouvelle propriété pour les forums filtrés
  searchQuery: string = ''; // Nouvelle propriété pour la recherche
  isLoading = true;
  errorMessage = '';
  addForumForm: FormGroup;
  forumToEdit: Forum | null = null;
  showAddForm: boolean = false; // Contrôle l'affichage de la sidebar
  editMode: boolean = false; // Contrôle le mode édition
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private forumService: ForumService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, // Injecter ChangeDetectorRef
  ) 
  
  
  {
    this.addForumForm = this.fb.group({
      title: ['', [Validators.required, titleValidator]], // Ajoutez titleValidator
      description: ['', [Validators.required, descriptionValidator]], // Ajoutez descriptionValidator
      image: [null], // L'image peut être vide
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
        this.filteredForums = data; // Initialiser filteredForums avec les forums chargés
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
    formData.append('userId', '2'); // Ajouter userId
  
    if (this.addForumForm.value.image) {
      formData.append('image', this.addForumForm.value.image);
    }
  
    this.forumService.addForum(formData).subscribe({
      next: (newForum) => {
        this.forums.push(newForum); // Ajouter le nouveau forum à la liste locale
        this.filteredForums = [...this.forums]; // Mettre à jour la liste filtrée
        this.addForumForm.reset(); // Réinitialiser le formulaire
        this.showAddForm = false; // Masquer le formulaire
        this.errorMessage = ''; // Réinitialiser le message d'erreur
        this.cdr.detectChanges(); // Forcer la détection des changements
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

     // Réappliquer les validateurs
  this.addForumForm.get('title')?.setValidators([Validators.required, titleValidator]);
  this.addForumForm.get('description')?.setValidators([Validators.required, descriptionValidator]);

    this.addForumForm.patchValue({
      forum_id: forum.forum_id, // Ajouter forum_id au formulaire
      title: forum.title,
      description: forum.description,
      image: null, // Réinitialiser l'image pour éviter les conflits
    });

     // Mettre à jour la validation
  this.addForumForm.get('title')?.updateValueAndValidity();
  this.addForumForm.get('description')?.updateValueAndValidity();
  
    // Supprimer la validation requise en mode édition
    
  }

  // Mise à jour d'un forum
  updateForum(): void {
    if (!this.forumToEdit) return;
  
    const { title, description, image } = this.addForumForm.value;
    const formData = new FormData();
    formData.append('forum_id', this.forumToEdit.forum_id!.toString()); // Inclure forum_id
    formData.append('title', title); // Champ obligatoire
    formData.append('description', description); // Champ obligatoire
  
    if (image) {
      formData.append('image', image); // Champ optionnel
    }
  
    this.forumService.updateForum(this.forumToEdit.forum_id!, formData).subscribe({
      next: (updatedForum) => {
        console.log('Réponse du serveur :', updatedForum);
  
        // Mettre à jour la liste des forums sans recharger la page
        this.forums = this.forums.map((forum) =>
          forum.forum_id === this.forumToEdit!.forum_id ? { ...forum, ...updatedForum } : forum
        );
        this.filteredForums = [...this.forums]; // Mettre à jour la liste filtrée
  
        this.cdr.detectChanges(); // Forcer la détection des changements
  
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
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    if (this.editMode && this.forumToEdit) {
      // Mode édition : mettre à jour le forum existant sans vérifier la validité du formulaire
      this.updateForum();
    } else {
      // Mode ajout : créer un nouveau forum avec validation du formulaire
      if (this.addForumForm.invalid) {
        alert('Veuillez corriger les erreurs du formulaire.');
        console.log('Formulaire invalide', this.addForumForm.value);
        return;
      }
      this.addForum();
    }
  }

  // Méthode pour obtenir les forums paginés
  get paginatedForums(): Forum[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredForums.slice(startIndex, endIndex); // Utilise this.filteredForums
  }

  // Méthode pour obtenir le nombre total de pages
  getTotalPages(): number {
    return Math.ceil(this.forums.length / this.itemsPerPage);
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

  applyFilter(): void {
    console.log('Recherche en cours :', this.searchQuery); // Debug
    if (!this.searchQuery) {
      this.filteredForums = this.forums;
    } else {
      this.filteredForums = this.forums.filter(
        (forum) =>
          forum.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          forum.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    console.log('Forums filtrés :', this.filteredForums); // Debug
    this.currentPage = 1;
    this.cdr.detectChanges(); // Forcer la détection des changements

  }
}