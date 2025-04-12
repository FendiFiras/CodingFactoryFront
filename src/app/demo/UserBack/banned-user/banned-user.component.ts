import { Component, OnInit, ViewChild } from '@angular/core';
import { BanLogService } from 'src/app/services/banlog.service';
import { BanLog } from 'src/app/models/ban-log';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banned-users',
    standalone: true,  // Ajouté pour standalone mode

  imports: [SharedModule],
  templateUrl: './banned-user.component.html',
  styleUrls: ['./banned-user.component.scss'] 
})
export class BannedUsersComponent implements OnInit {
  bannedUsers: BanLog[] = [];
  editForm: FormGroup;
  selectedBanLog: BanLog | null = null;
  paginatedUsers: any[] = [];
  // Variables pour la pagination
  page: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;
  users: any[] = [];
  bannedUsersPaginated: any[] = [];

  @ViewChild('editModal') editModal: any;

  constructor(private banlogservice: BanLogService, private fb: FormBuilder, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getBannedUsers();
    this.editForm = this.fb.group({
      idBan: [''],
      banDuration: [''],
      banReason: [''],
      status: ['']
    });
  }

  getBannedUsers(): void {
    this.banlogservice.getAllBanLogs().subscribe(
      (data: BanLog[]) => {
        this.bannedUsers = data;
        this.totalPages = Math.ceil(this.bannedUsers.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      (error) => {
        console.error('Erreur lors de la récupération des BanLogs :', error);
      }
    );
  }
 // Mettre à jour la liste des utilisateurs affichés pour la pagination
 updatePaginatedUsers(): void {
  const start = (this.page - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.bannedUsersPaginated  = this.bannedUsers.slice(start, end);
}

// Changer de page
changePage(newPage: number): void {
  if (newPage > 0 && newPage <= this.totalPages) {
    this.page = newPage;
    this.updatePaginatedUsers();
  }
}
  openEditModal(banLog: BanLog): void {
    this.selectedBanLog = banLog;
    this.editForm.patchValue({
      idBan: banLog.idBan,
      banDuration: new Date(banLog.banDuration).toISOString().slice(0, 16), // Format pour <input type="datetime-local">
      banReason: banLog.banReason,
      status: banLog.status
    });
    this.modalService.open(this.editModal);
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedBanLog = this.editForm.value;
      console.log("Données envoyées :", updatedBanLog);
      
      this.banlogservice.modifyBanLog(updatedBanLog).subscribe(
        () => {
          this.getBannedUsers();
          this.modalService.dismissAll();
        },
        (error) => console.error("Erreur lors de la modification :", error)
      );
    }
  }
  

  deleteBanLog(id: number): void {
    if (confirm('Are you sure you want to delete this ban?')) {
      this.banlogservice.deleteBanLog(id).subscribe(
        () => {
          this.getBannedUsers(); // Refresh la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du BanLog :', error);
        }
      );
    }
  }
   minimumBanDurationValidator(control: AbstractControl) {
      if (!control.value) {
        return null;
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);
  
      if (selectedDate <= today) {
        return { invalidBanDuration: true };
      }
      return null;
    }
}