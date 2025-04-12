import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog } from 'src/app/models/ban-log';
import { Status } from 'src/app/models/ban-log';

@Component({
  selector: 'app-liste-users',
  imports: [SharedModule],
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.scss']
})
export class ListeUsersComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  editForm: FormGroup;
  banForm: FormGroup;
  selectedUser: any;
  selectedBanUser: any;
  errorMessage: string | null = null;

  // Variables pour la pagination
  page: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;
  searchQuery: string = '';  // Stocke la recherche
  filteredUsers: any[] = []; // Liste des utilisateurs filtrés
  constructor(
    private userService: UserService,
    private banLogService: BanLogService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.banForm = this.fb.group({
      banDuration: ['', [Validators.required, this.minimumBanDurationValidator]],
      banReason: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          Validators.pattern(/^[a-zA-Z0-9.,!? ]+$/)
        ]
      ],
      status: [Status.ACTIVE]
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  // Récupérer la liste des utilisateurs
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = [...this.users]; // Initialisation de la liste filtrée
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  
  // Mettre à jour la liste des utilisateurs affichés pour la pagination
  updatePaginatedUsers(): void {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }
  

  // Changer de page
  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePaginatedUsers();
    }
  }

  // Ouvrir la modale pour ajouter un BanLog
  openBanModal(user: any, content: any): void {
    this.selectedBanUser = user;
    this.banForm.reset({ status: Status.ACTIVE });
    this.modalService.open(content, { ariaLabelledBy: 'banUserModalLabel' });
  }

  // Soumettre le formulaire de ban
  onBanSubmit(): void {
    if (this.banForm.valid && this.selectedBanUser) {
      const banDurationISO = new Date(this.banForm.value.banDuration).toISOString();

      const banLog: BanLog = {
        ...this.banForm.value,
        banDuration: banDurationISO,
        userId: this.selectedBanUser.idUser,
        status: Status.ACTIVE
      };

      this.banLogService.addBanLog(this.selectedBanUser.idUser, banLog).subscribe(
        (response) => {
          console.log('BanLog ajouté :', response);
          alert('L\'utilisateur a été banni avec succès.');
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du BanLog', error);
        }
      );
    }
  }

  // Validation pour s'assurer que la durée du ban est au moins un jour après aujourd'hui
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
