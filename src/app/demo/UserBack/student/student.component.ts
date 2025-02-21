import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service'; // Service pour bannir les utilisateurs
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog, Status } from 'src/app/models/ban-log';

@Component({
  selector: 'app-student',
  imports: [SharedModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  users: any[] = []; // Liste des étudiants
  editForm: FormGroup; // Formulaire pour modifier un étudiant
  banForm: FormGroup; // Formulaire pour bannir un étudiant
  selectedUser: any; // Étudiant sélectionné pour modification
  selectedBanUser: any; // Étudiant sélectionné pour bannissement

  constructor(
    private userService: UserService,
    private banLogService: BanLogService, // Injection du service BanLog
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    // Initialisation du formulaire de modification
    this.editForm = this.fb.group({
      idUser: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      role: [''],
      cv: [''],
      dateOfBirth: [''],
      gender: [''],
      image: [''],
      level: [''],
      password: ['']
    });

    // Initialisation du formulaire de bannissement
    this.banForm = this.fb.group({
      banDuration: ['', Validators.required], // Date de fin du bannissement
      banReason: ['', Validators.required], // Raison du bannissement
      status: [Status.ACTIVE] // Statut par défaut
    });
  }

  ngOnInit(): void {
    this.getUsersByRole('STUDENT'); // Charger la liste des étudiants au démarrage
  }

  // Récupérer la liste des étudiants
  getUsersByRole(role: string): void {
    this.userService.getUsersByRole(role).subscribe(
      (data) => {
        this.users = data;
        console.log('Étudiants récupérés:', this.users);
      },
      (error) => {
        console.error('Erreur lors de la récupération des étudiants', error);
      }
    );
  }

  // Ouvrir la modale de modification
  openEditModal(user: any, content: any): void {
    this.selectedUser = user;
    this.editForm.patchValue(user);
    this.modalService.open(content, { ariaLabelledBy: 'editUserModalLabel' });
  }

  // Ouvrir la modale pour bannir un étudiant
  openBanModal(user: any, content: any): void {
    this.selectedBanUser = user; 
    this.banForm.reset({ status: Status.ACTIVE }); 
    this.modalService.open(content, { ariaLabelledBy: 'banUserModalLabel' });
  }

  // Soumettre le formulaire de modification
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value;
      this.userService.modifyUser(updatedUser).subscribe(
        (response) => {
          console.log('Étudiant modifié :', response);
          this.getUsersByRole('STUDENT');
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'étudiant', error);
        }
      );
    }
  }

  // Soumettre le formulaire de bannissement
  onBanSubmit(): void {
    if (this.banForm.valid && this.selectedBanUser) {
      const banDurationISO = new Date(this.banForm.value.banDuration).toISOString();
  
      const banLog: BanLog = {
        ...this.banForm.value,
        banDuration: banDurationISO, 
        userId: this.selectedBanUser.idUser 
      };
  
      this.banLogService.addBanLog(this.selectedBanUser.idUser, banLog).subscribe(
        (response) => {
          console.log('BanLog ajouté :', response);
          alert('L\'étudiant a été banni avec succès.');
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du BanLog', error);
        }
      );
    }
  }

  // Supprimer un étudiant
  deleteUser(id: number): void {
    if (!id) {
      console.error('ID invalide');
      return;
    }
    if (confirm('Do you really want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User successfully deleted');
          this.getUsersByRole('STUDENT');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'étudiant', error);
        }
      );
    }
  }
}
