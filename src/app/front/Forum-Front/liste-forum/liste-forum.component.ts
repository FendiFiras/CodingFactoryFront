import { CommonModule } from '@angular/common';
import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from 'src/app/service/forum.service';
import { FooterComponent } from '../../elements/footer/footer.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule



interface Forum {
  forum_id?: number;
  title: string;
  description: string;
  image?: string;
  creationDate?: Date;
}

@Component({
  selector: 'app-liste-forum',
  templateUrl: './liste-forum.component.html',
  styleUrls: ['./liste-forum.component.scss'],
  imports: [CommonModule, SharedModule, NavbarComponent, FooterComponent,RouterModule]


})
export class ListeForumComponent implements OnInit {
  forums: Forum[] = [];
  isLoading = true;
  errorMessage = '';
  showAddForm = false;
  addForumForm: FormGroup;

  constructor(private forumService: ForumService, private fb: FormBuilder,   private cdr: ChangeDetectorRef ,    private router: Router // Injectez Router

  ) {
    this.addForumForm = this.fb.group({
      userId: ['', Validators.required],  // Ajout de l'ID utilisateur
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null] // Changer la valeur initiale à null
    });
  }

  ngOnInit(): void {
    this.loadForums();
  }
  navigateToForum(forumId: number): void {
    this.router.navigate(['/forum', forumId]); // Navigue vers la route forum/:forumId
  }
  loadForums(): void {
    this.isLoading = true;
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        this.forums = data;
        console.log("Forums after loading:", this.forums); // Vérifiez les données après chargement
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading forums';
        this.isLoading = false;
      }
    });
  }
  
  
  

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addForum(): void {
    if (this.addForumForm.invalid) return;
    const {userId, title, description, image } = this.addForumForm.value;
    
    // Créer un FormData pour envoyer les données du formulaire et l'image
    const formData = new FormData();
    formData.append('userId', userId); // Ajouter l'ID de l'utilisateur
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, image.name);
    }
    

    // Appeler le service pour ajouter le forum
    this.forumService.addForum(formData).subscribe({
      next: (newForum) => {
        this.forums.push(newForum);
        this.addForumForm.reset();
        this.showAddForm = false;
      },
      error: () => {
        this.errorMessage = 'Error adding forum';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.addForumForm.patchValue({ image: file });
    }
  }

  editMode = false;
forumToEdit: Forum | null = null;

editForum(forum: Forum): void {
  this.editMode = true;
  this.forumToEdit = { ...forum };
  this.addForumForm.patchValue({
    title: forum.title,
    description: forum.description
  });
}


updateForum(): void {
  if (!this.forumToEdit) return;

  const { title, description, image } = this.addForumForm.value;
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  if (image) {
    formData.append('image', image, image.name);
  }

  this.forumService.updateForum(this.forumToEdit!.forum_id!, formData).subscribe({
    next: (updatedForum) => {
      this.forums = this.forums.map(f => f.forum_id === updatedForum.id ? updatedForum : f);
      this.editMode = false;
      this.forumToEdit = null;
      this.addForumForm.reset();
    },
    error: () => {
      this.errorMessage = "Error updating forum";
    }
  });
}
confirmDelete(forum_id: number | undefined): void {
  if (forum_id === undefined || forum_id === null) {
    this.errorMessage = "Invalid forum ID.";
    return;
  }

  if (confirm("Are you sure you want to delete this forum?")) {
    this.forumService.deleteForum(forum_id).subscribe({
      next: () => {
        // Supprimer l'élément localement
        this.forums = this.forums.filter(forum => forum.forum_id !== forum_id);

        // Forcer la détection des changements
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Error deleting forum";
      }
    });
  }
}







debugForum(forum: Forum): void {
  console.log("Forum sélectionné :", forum);
}



}
