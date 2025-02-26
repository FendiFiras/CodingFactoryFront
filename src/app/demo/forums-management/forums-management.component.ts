import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ForumService } from 'src/app/service/forum.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [ReactiveFormsModule, CommonModule],
})
export class ForumsManagementComponent implements OnInit {
  forums: Forum[] = [];
  isLoading = true;
  errorMessage = '';
  showAddForm = false;
  addForumForm: FormGroup;
  editMode = false;
  forumToEdit: Forum | null = null;

  constructor(
    private forumService: ForumService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef // Injecter ChangeDetectorRef

  ) {
    this.addForumForm = this.fb.group({
      userId: [null, Validators.required], // Ajouter le champ userId
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required], // Ajout de la validation pour l'image si nécessaire
    });
  }

  ngOnInit(): void {
    this.loadForums();
  }

  // Affiche/Masque le formulaire d'ajout
  toggleAddForm(): void {
    console.log('toggleAddForm appelé, showAddForm =', !this.showAddForm);
    this.showAddForm = !this.showAddForm;
    this.editMode = false;
    this.forumToEdit = null;
    this.addForumForm.reset();
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
    formData.append('userId', this.addForumForm.value.userId.toString()); // Utiliser userId du formulaire
    if (this.addForumForm.value.image) {
      formData.append('image', this.addForumForm.value.image);
    }
  
    // Log FormData contents
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
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

  // Navigation vers les discussions d’un forum
  navigateToDiscussions(forumId: number): void {
    this.router.navigate(['/forum', forumId, 'discussions']);
  }

  // Édition d'un forum
  editForum(forum: Forum): void {
    this.editMode = true;
    this.forumToEdit = { ...forum }; // Conserver l'objet forum à modifier
    this.showAddForm = true;
    this.addForumForm.patchValue({
      title: forum.title,
      description: forum.description,
      image: null, // Réinitialiser l'image pour éviter les conflits
    });
  }

  // Mise à jour d'un forum
  updateForum(): void {
    if (!this.forumToEdit) return;
  
    const { title, description, image } = this.addForumForm.value;
    const formData = new FormData();
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
    }}      
  
}