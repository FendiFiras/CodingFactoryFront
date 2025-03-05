import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Reclamation } from 'src/app/Models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";

@Component({
  selector: 'app-reclamation-list',
  imports: [RouterLink, CommonModule, NavbarComponent,],
  templateUrl: './reclamation-list.component.html',
  styleUrl: './reclamation-list.component.scss'
})
export class ReclamationListComponent implements OnInit {

  userId = 1; // Static user ID
  reclamations: Reclamation[] = [];

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserReclamations();
  }

  loadUserReclamations(): void {
    this.reclamationService.getReclamationsByUser(this.userId).subscribe(
      (data) => this.reclamations = data,
      (error) => console.error('Error loading user reclamations:', error)
    );
  }

  deleteReclamation(id: number): void {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.reclamationService.deleteReclamation(id).subscribe(() => {
        this.loadUserReclamations();
      });
    }
  }

  editReclamation(id: number): void {
    this.router.navigate([`/user/reclamation-edit/${id}`]);
  }
}
