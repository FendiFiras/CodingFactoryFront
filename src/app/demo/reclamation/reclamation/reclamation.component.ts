import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Reclamation } from 'src/app/models/reclamation.model';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Message } from 'src/app/models/message';
import { HttpClient } from '@angular/common/http';
import { ChatComponent } from '../chat/chat.component';

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
    ChatComponent
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
  materialStats: { label: string, totalQuantity: number }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
    this.loadMaterialStats();

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
    // Create a custom dialog dynamically
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    dialog.style.zIndex = '1000';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '90%';

    dialog.innerHTML = `
      <h3 style="font-size: 1.5rem; color: #333; margin-bottom: 15px;">Treat Reclamation</h3>
      <p style="color: #555; margin-bottom: 20px;">
        Enter the quantity to add for ${reclamation.materials[0]?.label || 'Unknown Material'}:
      </p>
      <input
        type="number"
        id="quantityInput"
        min="0"
        value="0"
        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; color: #333;"
      >
      <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
        <button
          id="cancelBtn"
          style="padding: 8px 15px; border: none; border-radius: 5px; background-color: #6c757d; color: white; cursor: pointer; font-weight: 600;"
        >Cancel</button>
        <button
          id="submitBtn"
          style="padding: 8px 15px; border: none; border-radius: 5px; background-color: #28a745; color: white; cursor: pointer; font-weight: 600;"
        >Submit</button>
      </div>
    `;

    document.body.appendChild(dialog);

    const submitBtn = dialog.querySelector('#submitBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const quantityInput = dialog.querySelector('#quantityInput') as HTMLInputElement;

    const handleSubmit = () => {
      const quantity = quantityInput.value;
      const quantityToAdd = parseInt(quantity, 10);
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
            document.body.removeChild(dialog);
          },
          (error) => {
            console.error('Error treating reclamation:', error);
            alert('Failed to treat reclamation.');
            document.body.removeChild(dialog);
          }
        );
    };

    const handleCancel = () => {
      document.body.removeChild(dialog);
    };

    submitBtn?.addEventListener('click', handleSubmit);
    cancelBtn?.addEventListener('click', handleCancel);
    quantityInput?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') handleSubmit();
    });
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

  loadMaterialStats() {
    this.reclamationService.getMaterialStats().subscribe(stats => {
      this.materialStats = stats;
    });
  }
}