/* 
import { Component, OnInit } from '@angular/core';
import { Forum } from 'src/app/models/forum';
import { ForumService } from 'src/app/service/forum.service';
import { FooterComponent } from "../../elements/footer/footer.component";
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-fourms-list',
  templateUrl: './fourms-list.component.html',
  styleUrls: ['./fourms-list.component.scss'],
  imports: [CommonModule, FooterComponent, NavbarComponent, SharedModule]
})
export class FourmsListComponent implements OnInit {
  forums: Forum[] = []; // Tableau pour stocker les forums récupérés
  forum: Forum = { forum_id: 0, title: '', description: '', image: '', creationDate: '' };
  selectedImage: File | null = null; // Pour stocker l'image sélectionnée

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.fetchForums();
  }

  fetchForums(): void {
    this.forumService.getAllForums().subscribe({
      next: (data: Forum[]) => {
        this.forums = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des forums:', error);
      }
    });
  }

  // Gérer le changement d'image
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('title', this.forum.title);
      formData.append('description', this.forum.description);
      formData.append('image', this.selectedImage, this.selectedImage.name);
      
      // Envoyer les données via le service
      this.forumService.addForumWithImage(formData).subscribe({
        next: (data) => {
          console.log('Forum ajouté:', data);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du forum:', error);
        }
      });
    }
  }
}
*/