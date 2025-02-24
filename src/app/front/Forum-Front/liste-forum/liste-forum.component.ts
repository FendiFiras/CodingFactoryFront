import { Component, OnInit } from '@angular/core';
import { ForumService } from 'src/app/service/forum.service';
import { Forum } from 'src/app/models/forum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // Importer ReactiveFormsModule

@Component({
  selector: 'app-liste-forum',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule], // Import necessary modules
  templateUrl: './liste-forum.component.html',
  styleUrls: ['./liste-forum.component.scss'],
})
export class ListeForumComponent implements OnInit {
  forums: Forum[] = []; // Array to hold forums
  isLoading: boolean = true; // Loading state
  errorMessage: string | null = null;
  showAddForm: boolean = false; // Pour afficher/masquer le formulaire
  addForumForm: FormGroup;
  


  constructor(private forumService: ForumService, private fb: FormBuilder) {
    this.addForumForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [''], // Image facultative
    });
  }
  ngOnInit(): void {
    this.loadForums(); // Load forums on component initialization
  }

  // Fetch all forums
  loadForums(): void {
    this.forumService.getAllForums().subscribe({
      next: (data) => {
        this.forums = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching forums:', err);
        this.errorMessage = 'Failed to load forums. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  addForum(): void {
    if (this.addForumForm.valid) {
        const userId = 1; // Static ID
        const { title, description, image } = this.addForumForm.value;

        // Create FormData object
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        // Only append the image if it's not null or undefined
        if (image) {
            formData.append("image", image);  // image is a File object (selected by the user)
        }

        // Send the FormData to the backend
        this.forumService.addForum(userId, formData).subscribe({
            next: (data) => {
                this.loadForums(); // Reload the forum list
                this.showAddForm = false; // Close the form
                this.addForumForm.reset(); // Reset the form
            },
            error: (err) => {
                console.error('Error adding forum:', err);
                this.errorMessage = 'Failed to add forum. Please try again.';
            },
        });
    }
}

  

  // Delete a forum
  deleteForum(forumId: number): void {
    if (confirm('Are you sure you want to delete this forum?')) {
      this.forumService.deleteForum(forumId).subscribe({
        next: (response) => {
          console.log(response);
          this.loadForums(); // Reload forums after deletion
        },
        error: (err) => {
          console.error('Error deleting forum:', err);
        },
      });
    }
  }
}