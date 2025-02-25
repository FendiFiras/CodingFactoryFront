import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service'; // Importez le service BanLog
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog } from 'src/app/models/ban-log'; // Importez le modèle BanLog
import { Status } from 'src/app/models/ban-log'; // Importez l'enum Status

@Component({
  selector: 'app-liste-users',
  imports: [SharedModule],
  templateUrl: './liste-users.component.html',
  styleUrls: ['./liste-users.component.scss'] 
})
export class ListeUsersComponent implements OnInit {
  users: any[] = []; // Liste des utilisateurs
  editForm: FormGroup; // Formulaire pour la modification
  banForm: FormGroup; // Formulaire pour l'ajout d'un BanLog
  selectedUser: any; // Utilisateur sélectionné pour la modification
  selectedBanUser: any; // Utilisateur sélectionné pour le ban

  constructor(
    private userService: UserService,
    private banLogService: BanLogService, // Injectez le service BanLog
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
      speciality: [''],
      companyName: [''],
      dateOfBirth: [''],
      gender: [''],
      grade: [''],
      image: [''],
      level: [''],
      password: ['']
    });

    // Initialisation du formulaire de ban
    this.banForm = this.fb.group({
      banDuration: ['', Validators.required], // Date de fin du ban
      banReason: ['', Validators.required], // Raison du ban
      status: [Status.ACTIVE] // Statut par défaut
    });
  }

  ngOnInit(): void {
    this.getUsers(); // Charger la liste des utilisateurs au démarrage
  }

  // Récupérer la liste des utilisateurs
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        console.log('Received users:', data);  // Check if users are being fetched correctly
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  

  // Ouvrir la modale de modification
  openEditModal(user: any, content: any): void {
    this.selectedUser = user;
    this.editForm.patchValue(user);
    this.modalService.open(content, { ariaLabelledBy: 'editUserModalLabel' });
  }

  // Ouvrir la modale pour ajouter un BanLog
  openBanModal(user: any, content: any): void {
    this.selectedBanUser = user; // Stocker l'utilisateur sélectionné pour le ban
    this.banForm.reset({ status: Status.ACTIVE }); // Réinitialiser le formulaire avec le statut par défaut
    this.modalService.open(content, { ariaLabelledBy: 'banUserModalLabel' });
  }

  // Soumettre le formulaire de modification
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value;
      this.userService.modifyUser(updatedUser).subscribe(
        (response) => {
          console.log('Utilisateur modifié :', response);
          this.getUsers();
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'utilisateur', error);
        }
      );
    }
  }

  // Soumettre le formulaire de ban
  onBanSubmit(): void {
    if (this.banForm.valid && this.selectedBanUser) {
      // Formater la date au format ISO 8601
      const banDurationISO = new Date(this.banForm.value.banDuration).toISOString();
  
      const banLog: BanLog = {
        ...this.banForm.value,
        banDuration: banDurationISO, // Utiliser la date formatée
        userId: this.selectedBanUser.idUser // Associer l'ID de l'utilisateur
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
    if (confirm('Do you really want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User successfully deleted');
          this.getUsers();
        },
        (error) => {
          console.error('Error while deleting the user', error);
        }
      );
    }
  }
  
}