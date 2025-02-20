import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Pour la modale Bootstrap

@Component({
  selector: 'app-liste-users',
  imports: [SharedModule],
  templateUrl: './liste-users.component.html',
  styleUrl: './liste-users.component.scss'
})
export class ListeUsersComponent implements OnInit {
  users: any[] = []; // Liste des utilisateurs
  editForm: FormGroup; // Formulaire réactif pour la modification
  selectedUser: any; // Utilisateur sélectionné pour la modification

  constructor(
    private userService: UserService,
    private fb: FormBuilder, // Pour créer le formulaire réactif
    private modalService: NgbModal // Pour gérer la modale
  ) {
    // Initialisation du formulaire réactif
    this.editForm = this.fb.group({
      idUser: [''], // Champ caché pour l'ID de l'utilisateur
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
  }

  ngOnInit(): void {
    this.getUsers(); // Charger la liste des utilisateurs au démarrage
  }

  // Récupérer la liste des utilisateurs
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        console.log('Users:', this.users); // Log pour vérifier les données
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  // Ouvrir la modale de modification
  openEditModal(user: any, content: any): void {
    this.selectedUser = user; // Stocker l'utilisateur sélectionné
    this.editForm.patchValue(user); // Pré-remplir le formulaire avec les données de l'utilisateur
    this.modalService.open(content, { ariaLabelledBy: 'editUserModalLabel' }); // Ouvrir la modale
  }

  // Soumettre le formulaire de modification
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value; // Récupérer les valeurs du formulaire
      this.userService.modifyUser(updatedUser).subscribe(
        (response) => {
          console.log('Utilisateur modifié :', response);
          this.getUsers(); // Rafraîchir la liste des utilisateurs
          this.modalService.dismissAll(); // Fermer la modale
        },
        (error) => {
          console.error('Erreur lors de la modification de l\'utilisateur', error);
        }
      );
    }
  }

  // Supprimer un utilisateur
  deleteUser(id: number): void {
    if (!id) {
      console.error('ID is undefined or invalid');
      return;
    }
    console.log('Deleting user with ID:', id); // Log pour vérifier l'ID
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log('Utilisateur supprimé avec succès');
        this.getUsers(); // Rafraîchir la liste des utilisateurs
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      }
    );
  }
}