import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ForumService } from 'src/app/service/forum.service';
import { Forum } from 'src/app/models/forum';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class LeftSideBarComponent implements OnInit {
  latestForums: Forum[] = [];

  constructor(
    private forumService: ForumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLatestForums();
  }

  loadLatestForums(): void {
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        console.log('Données brutes de l\'API:', data); // Debug important
        
        this.latestForums = data.map((forum: any) => {
          // Validation de l'ID
          const forumId = forum.id ?? forum.forum_id;
          if (!forumId || isNaN(forumId)) {
            console.error('Forum ID invalide:', forum);
            return null;
          }
  
          return {
            forum_id: Number(forumId), // Conversion explicite en nombre
            title: forum.title || 'Titre inconnu',
            description: forum.description || 'Description inconnue',
            image: forum.image || null,
            creationDate: new Date(forum.creationDate || Date.now())
          };
        }).filter(forum => forum !== null) // Filtre les forums invalides
        .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
        .slice(0, 3);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  navigateToForum(forumId: number | undefined): void {
    if (forumId) {
      console.log('Navigating to forum:', forumId); // Vérifiez que cette ligne s'exécute
      this.router.navigate(['/forum', forumId]).then(nav => {
        console.log('Navigation success:', nav);
      }, err => {
        console.error('Navigation failed:', err);
      });
    }
  }
}