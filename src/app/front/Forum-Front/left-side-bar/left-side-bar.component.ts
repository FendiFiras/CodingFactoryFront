import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { RouterModule } from '@angular/router'; // Importez RouterModule
import { ForumService } from 'src/app/service/forum.service';
import { Forum } from 'src/app/models/forum'; // Importez le modèle correct

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  standalone: true, // Si vous utilisez un composant standalone
  imports: [CommonModule, RouterModule], // Ajoutez les modules nécessaires
})
export class LeftSideBarComponent implements OnInit {
  latestForums: Forum[] = [];

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.loadLatestForums();
  }

  loadLatestForums(): void {
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        console.log('Data from API:', data); // Inspectez la structure des données

        // Mapper les données pour qu'elles correspondent à l'interface Forum
        this.latestForums = data.map((forum: any) => ({
          forum_id: forum.id || 0, // Si l'API retourne 'id' au lieu de 'forum_id'
          title: forum.title || 'Titre inconnu',
          description: forum.description || 'Description inconnue',
          image: forum.image || null, // 'image' peut être null
          creationDate: new Date(forum.creationDate || Date.now()), // Convertir en objet Date
        })).sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        }).slice(0, 3); // Garder seulement les 3 premiers
      },
      error: (err) => {
        console.error('Error loading forums:', err);
      }
    });
  }
}