import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Reclamation } from 'src/app/models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { NavbarComponent } from "../../elements/navbar/navbar.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ChatModalComponent } from 'src/app/chat-modal/chat-modal.component';

@Component({
  selector: 'app-reclamation-list',
  imports: [RouterLink, NavbarComponent,CommonModule, MatTableModule, MatPaginatorModule,
    MatButtonModule, ChatModalComponent],
  templateUrl: './reclamation-list.component.html',
  styleUrl: './reclamation-list.component.scss'
})
export class ReclamationListComponent implements OnInit {

  userId = 1; // Static user ID
  reclamations: Reclamation[] = [];
  displayedColumns: string[] = [
    'title',
    'description',
    'type',
    'urgencyLevel',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Reclamation>(this.reclamations);
  activeChatReclamationId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserReclamations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openChat(id: number) {
    this.activeChatReclamationId = id;
  }
  
  closeChat() {
    this.activeChatReclamationId = null;
  }

  loadUserReclamations(): void {
    this.reclamationService.getReclamationsByUser(this.userId).subscribe(
      (data) => {
        this.reclamations = data;
        this.dataSource.data = this.reclamations;
      },
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
