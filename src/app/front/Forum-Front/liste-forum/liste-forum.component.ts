import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from 'src/app/service/forum.service';
import { FooterComponent } from '../../elements/footer/footer.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Forum {
  id?: number;
  title: string;
  description: string;
  image?: string;
  creationDate?: Date;
}

@Component({
  selector: 'app-liste-forum',
  templateUrl: './liste-forum.component.html',
  styleUrls: ['./liste-forum.component.scss'],
  imports: [CommonModule,  SharedModule]


})
export class ListeForumComponent implements OnInit {
  forums: Forum[] = [];
  isLoading = true;
  errorMessage = '';
  showAddForm = false;
  addForumForm: FormGroup;

  constructor(private forumService: ForumService, private fb: FormBuilder) {
    this.addForumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null] // Changer la valeur initiale à null
    });
  }

  ngOnInit(): void {
    this.loadForums();
  }

  loadForums(): void {
    this.isLoading = true;
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        this.forums = data;
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
    const { title, description, image } = this.addForumForm.value;
    
    // Créer un FormData pour envoyer les données du formulaire et l'image
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, image.name);
    }
    
    const userId = 1; // Remplacer par l'ID utilisateur dynamique si nécessaire

    // Appeler le service pour ajouter le forum
    this.forumService.addForum(userId, formData).subscribe({
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
}
