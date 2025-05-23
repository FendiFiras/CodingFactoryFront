import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumService } from 'src/app/services/forum.service';
import { FooterComponent } from '../../elements/footer/footer.component';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LeftSideBarComponent } from 'src/app/front/Forum-Front/left-side-bar/left-side-bar.component';
import { AIGeneratorService } from 'src/app/services/ai-generator.service';
import { AuthService } from 'src/app/services/auth-service.service';

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
  imports: [CommonModule, SharedModule, NavbarComponent, FooterComponent, RouterModule, LeftSideBarComponent],
  standalone: true,

})
export class ListeForumComponent implements OnInit {
  forums: Forum[] = [];
  isLoading = true;
  errorMessage = '';
  showAddForm: boolean = false;
  addForumForm: FormGroup;
  userId!: number;
  editMode = false;
  forumToEdit: Forum | null = null;
  suggestedTopics: string[] = [];
  isGenerating = false;
  // Dans votre classe ListeForumComponent
currentPage: number = 1;
itemsPerPage: number = 3;
totalItems: number = 0;
  


  constructor(
    private forumService: ForumService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private aiGenerator: AIGeneratorService,
    private router: Router,
    private authService: AuthService,

  ) {
    this.addForumForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-zÀ-ÿ0-9?!.\s:'-]+$/)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(150),
        Validators.pattern(/^[A-Za-zÀ-ÿ0-9?!.\s:'-]+$/)
      ]],
      image: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    this.authService.getUserInfo().subscribe({
      next: async (user) => {
        this.userId = user.idUser; // ✅ utiliser userId au lieu de staticUserId
        await this.generateNewTopics();
        this.loadForums();
      },
      error: (err) => {
        console.error("❌ Erreur récupération utilisateur :", err);
        this.router.navigate(['/login']);
      }
    });
    
  }
  

  loadForums(): void {
    this.isLoading = true;
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        this.forums = data.sort((a, b) => {
          const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
          const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
          return dateB - dateA;
        });
        this.totalItems = this.forums.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading forums';
        this.isLoading = false;
      },
    });
  }

  get paginatedForums(): Forum[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.forums.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editMode = false; // Désactiver le mode édition si activé

    if (!this.showAddForm) {
      this.addForumForm.reset();
    }
  }

  addForum(): void {
    if (this.addForumForm.invalid) return;

    const { title, description, image } = this.addForumForm.value;
    const formData = new FormData();
    formData.append('userId', this.userId.toString()); // ✅ utiliser userId
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image, image.name);
    }

    this.forumService.addForum(formData).subscribe({
      next: (newForum) => {
        this.forums.unshift(newForum); // Changez push() par unshift() ici
        this.addForumForm.reset();
        this.showAddForm = false;
      },
      error: () => {
        this.errorMessage = 'Error adding forum';
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.addForumForm.patchValue({ image: file });
    }
  }

  editForum(forum: Forum): void {
    this.editMode = true;
    this.forumToEdit = { ...forum };
    this.addForumForm.patchValue({
      title: forum.title,
      description: forum.description,
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
  
    this.forumService.updateForum(this.forumToEdit.forum_id!, formData).subscribe({
      next: () => {
        // Call the getAll method to refresh the forums list
        this.forumService.getAllForums().subscribe({
          next: (forums) => {
            // Update the local state with the latest data
            this.forums = forums;
  
            // Reset the form and edit mode
            this.editMode = false;
            this.forumToEdit = null;
            this.addForumForm.reset();
          },
          error: () => {
            this.errorMessage = 'Error fetching forums after update';
          },
        });
      },
      error: () => {
        this.errorMessage = 'Error updating forum';
      },
    });
  }
 
  confirmDelete(forum_id: number | undefined): void {
    if (forum_id === undefined || forum_id === null) {
      this.errorMessage = "Invalid forum ID.";
      return;
    }
  
    if (confirm("Are you sure you want to delete this forum?")) {
      console.log('Deleting forum with ID:', forum_id);
  
      this.forumService.deleteForum(forum_id).subscribe({
        next: () => {
          console.log('Forum deleted successfully.');
  
          // Fetch the latest list of forums
          this.forumService.getAllForums().subscribe({
            next: (forums) => {
              console.log('Fetched forums after deletion:', forums);
              this.forums = forums; // Update the local state
              this.cdr.detectChanges(); // Force change detection
            },
            error: (error) => {
              console.error('Error fetching forums:', error);
              this.errorMessage = "Error fetching forums after delete";
            },
          });
        },
        error: (error) => {
          console.error('Error deleting forum:', error);
          console.error('Error details:', error.error); // Log the response body
          this.errorMessage = "Error deleting forum";
        }
      });
    }
  }







debugForum(forum: Forum): void {
  console.log("Forum sélectionné :", forum);
}

async generateNewTopics() {
  this.isGenerating = true;
  try {
    this.suggestedTopics = await this.aiGenerator.generateTechTopics();
  } catch (error) {
    console.error("Erreur de génération IA:", error);
    this.suggestedTopics = [
      "Discussion : Comment optimiser les perfs web en 2024? - Partagez vos tricks",
      "Discussion : IA générative et dev - opportunités ou dangers?",
      "Discussion : Les erreurs de sécurité à éviter absolument"
    ];
  } finally {
    this.isGenerating = false;
  }
}


// Ajoutez cette méthode à votre classe ListeForumComponent
createForumFromTopic(topic: string) {
  this.addForumForm.patchValue({
    title: topic,
    description: 'Forum automatically generated on this topic'
  });
  this.showAddForm = true;
  this.editMode = false;
}




}