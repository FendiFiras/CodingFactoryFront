import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussionService } from 'src/app/service/Discussion.service';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-admin-discussion-messages',
  templateUrl: './admin-discussion-messages.component.html',
  styleUrls: ['./admin-discussion-messages.component.scss'],
  imports: [CommonModule], // ✅ Importez CommonModule ici

})
export class AdminDiscussionMessagesComponent implements OnInit {
  navMobClick() {
    throw new Error('Method not implemented.');
  }
  forumId!: number; // ✅ Déclarez forumId
  discussionId!: number;
  messages: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

   // Propriétés pour la navigation
   navCollapsed = false;
   navCollapsedMob = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router, // ✅ Injectez le Router ici
    private discussionService: DiscussionService,

  ) {}


  // Méthode pour revenir à la liste des discussions
  goBack(): void {
    this.router.navigate([`/admin/forum/${this.forumId}/discussions`]); 
  }

  ngOnInit(): void {
    this.forumId = +this.route.snapshot.paramMap.get('forumId')!; // ✅ Récupérez forumId
    this.discussionId = +this.route.snapshot.paramMap.get('discussionId')!;
    this.loadMessages();
  }


  loadMessages(): void {
    this.isLoading = true;
    this.messageService.getMessagesByDiscussion(this.discussionId).subscribe({
      next: (data) => {
        // Simulez userId si nécessaire
        this.messages = data.map((message) => ({
          ...message,
          userId: message.userId || 'Anonyme', // Si userId est manquant
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des messages';
        this.isLoading = false;
      },
    });
  }

}