import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Reclamation } from 'src/app/Models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Message } from 'src/app/Models/message';
import { ChatModalComponent } from 'src/app/chat-modal/chat-modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss'],
  standalone: true,
  imports: [
    RouterLink, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    ChatModalComponent
  ],
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  dataSource = new MatTableDataSource<Reclamation>(this.reclamations);
  displayedColumns: string[] = [
    'title',
    'description',
    'type',
    'status',
    'urgency',
    'creationDate',
    'file',
    'actions',
  ];

  isLoading = true;
  errorMessage = '';
  selectedReclamationIdForChat: number | null = null;
  chatOpenMap = new Map<number, boolean>();
  activeChats: Set<number> = new Set(); // idReclamation qui ont un message user

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadReclamations();

    setInterval(() => {
      this.reclamations
        .filter(r => r.status === 'IN_WAIT')
        .forEach(r => this.checkForNewMessages(r.idReclamation));
    }, 3000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  checkForNewMessages(reclamationId: number): void {
    this.http.get<Message[]>(`http://localhost:8082/api/messages/reclamation/${reclamationId}`).subscribe(messages => {
      const hasUserMessage = messages.some(msg => msg.sender === 'user');
  
      if (hasUserMessage) {
        this.activeChats.add(reclamationId);
        if (!this.chatOpenMap.get(reclamationId)) {
          this.selectedReclamationIdForChat = reclamationId;
          this.chatOpenMap.set(reclamationId, true);
        }
      }
    });
  }  

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;
        this.dataSource.data = this.reclamations;
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

  treatReclamation(reclamation: Reclamation): void {
    const newQuantity = prompt(
      `Enter the quantity to add for ${reclamation.materials[0]?.label}:`,
      '0'
    );

    if (newQuantity !== null) {
      const quantityToAdd = parseInt(newQuantity, 10);
      if (isNaN(quantityToAdd) || quantityToAdd < 0) {
        alert('Please enter a valid quantity.');
        return;
      }

      this.reclamationService
        .treatReclamation(reclamation.idReclamation, quantityToAdd)
        .subscribe(
          () => {
            this.loadReclamations();
            alert('Reclamation treated successfully!');
          },
          (error) => {
            console.error('Error treating reclamation:', error);
            alert('Failed to treat reclamation.');
          }
        );
    }
  }

  deleteReclamation(id: number): void {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.reclamationService.deleteReclamation(id).subscribe(
        () => {
          this.reclamations = this.reclamations.filter(
            (rec) => rec.idReclamation !== id
          );
          this.dataSource.data = this.reclamations;
        },
        (error) => {
          console.error('Error deleting reclamation:', error);
          alert('Failed to delete reclamation.');
        }
      );
    }
  }

  downloadFile(id: number, fileName: string): void {
    this.reclamationService.downloadFile(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading file:', error);
        alert('Failed to download file.');
      }
    );
  }  

  getUrgencyLabel(urgency: number): string {
    switch (urgency) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }
}
