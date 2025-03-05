import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Reclamation } from 'src/app/Models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.scss',
    standalone: true,
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ]
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching reclamations:', error);
        this.errorMessage = 'Failed to load reclamations.';
        this.isLoading = false;
      }
    );
  }

  editReclamation(id: number): void {
    this.router.navigate(['/admin/reclamation-edit', id]);
  }

  deleteReclamation(id: number): void {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.reclamationService.deleteReclamation(id).subscribe(
        () => {
          this.reclamations = this.reclamations.filter(rec => rec.idReclamation !== id);
        },
        (error) => {
          console.error('Error deleting reclamation:', error);
          alert('Failed to delete reclamation.');
        }
      );
    }
  }

  // ✅ Convert urgency number to label
  getUrgencyLabel(urgency: number): string {
    switch (urgency) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      default: return 'Unknown';
    }
  }
}
