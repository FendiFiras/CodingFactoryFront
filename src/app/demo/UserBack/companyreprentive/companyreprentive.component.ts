import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service'; // Service de gestion des bans
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog, Status } from 'src/app/models/ban-log';

@Component({
  selector: 'app-companyreprentive',
  imports: [SharedModule],
  templateUrl: './companyreprentive.component.html',
  styleUrls: ['./companyreprentive.component.scss']
})
export class CompanyReprentiveComponent implements OnInit {
  users: any[] = []; // Liste des représentants d'entreprise
  editForm: FormGroup; // Formulaire pour modifier un utilisateur
  banForm: FormGroup; // Formulaire pour bannir un utilisateur
  selectedUser: any; // Utilisateur sélectionné pour modification
  selectedBanUser: any; // Utilisateur sélectionné pour bannissement
  page: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'utilisateurs par page
  paginatedUsers: any[] = [];
  // Variables pour la pagination
  totalPages: number = 0;

  constructor(
    private userService: UserService,
    private banLogService: BanLogService, // Injection du service BanLog
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
   
    

   // Initialisation du formulaire de bannissement avec validation
   this.banForm = this.fb.group({
    banDuration: ['', [Validators.required, this.minimumBanDurationValidator]], // Validation personnalisée
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
  });}

  ngOnInit(): void {
    this.getUsersByRole('COMPANYREPRESENTIVE'); // Charger les représentants d'entreprise au démarrage
  }

 // Récupérer la liste des représentants d'entreprise
getUsersByRole(role: string): void {
  this.userService.getUsersByRole(role).subscribe(
    (data) => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePaginatedUsers(); // Mise à jour de la pagination après récupération
      console.log('Users:', this.users);
    },
    (error) => {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  );
}

 // Mettre à jour la liste des utilisateurs affichés pour la pagination
 updatePaginatedUsers(): void {
  const start = (this.page - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedUsers = this.users.slice(start, end);
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
        userId: this.selectedBanUser.idUser ,
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

  // Supprimer un utilisateur
  deleteUser(id: number): void {
    if (!id) {
      console.error('ID invalide');
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('Utilisateur supprimé avec succès');
          this.getUsersByRole('COMPANYREPRESENTIVE');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
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
