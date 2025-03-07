import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service';
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
  editForm: FormGroup; // Formulaire de modification
  banForm: FormGroup; // Formulaire de bannissement
  selectedUser: any; // Étudiant sélectionné pour modification
  selectedBanUser: any; // Étudiant sélectionné pour bannissement
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalItems: number = 0;
  paginatedUsers: any[] = [];
  Math = Math; // Ajoute cette ligne dans ta classe StudentComponent



  constructor(
    private userService: UserService,
    private banLogService: BanLogService,
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
    });
  }

  ngOnInit(): void {
    this.getUsersByRole('STUDENT');
  }

  // Récupérer la liste des étudiants
  getUsersByRole(role: string): void {
    this.userService.getUsersByRole(role).subscribe(
      (data) => {
        this.users = data;
        this.totalItems = this.users.length;
        this.updatePaginatedUsers();
      },
      (error) => {
        console.error('Erreur lors de la récupération des étudiants', error);
      }
    );
  }
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }
  changePage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }
    

  // Ouvrir la modale de modification
  openEditModal(user: any, content: any): void {
    this.selectedUser = user;
    const formattedDateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '';
    this.editForm.patchValue({
      ...user,
      dateOfBirth: formattedDateOfBirth
    });
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
      if (updatedUser.dateOfBirth) {
        updatedUser.dateOfBirth = new Date(updatedUser.dateOfBirth).toISOString();
      }
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
        userId: this.selectedBanUser.idUser,
        status: Status.ACTIVE
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