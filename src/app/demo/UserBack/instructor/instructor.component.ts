import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service'; // Service de gestion des bans
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog, Status } from 'src/app/models/ban-log';
import { AuthService } from 'src/app/services/auth-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-instructor',
  imports: [SharedModule ],
 templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {
  users: any[] = [User]; // Liste des instructeurs
  editForm: FormGroup; // Formulaire pour modifier un utilisateur
  banForm: FormGroup; // Formulaire pour bannir un utilisateur
  selectedUser: any; // Utilisateur sélectionné pour modification
  selectedBanUser: any; // Utilisateur sélectionné pour bannissement
  cvUrl: SafeResourceUrl | null = null;
  rejectForm: FormGroup;
  successMessage: string | null = null;
errorMessage: string | null = null;
paginatedUsers: any[] = [];
  // Variables pour la pagination
  page: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  constructor(
    private userService: UserService,
    private banLogService: BanLogService, // Injection du service BanLog
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authservice: AuthService,
    private sanitizer: DomSanitizer
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
   // Initialisation du formulaire de refus
   this.rejectForm = this.fb.group({
    rejectReason: ['', Validators.required] // Raison du refus
  });
  }

  ngOnInit(): void {
    this.getUsersByRole('INSTRUCTOR'); // Charger les instructeurs au démarrage
  }

  // Récupérer la liste des instructeurs
  getUsersByRole(role: string): void {
    this.userService.getUsersByRole(role).subscribe(
      (data) => {
        this.users = data;
        console.log('Users:', this.users);
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
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
  openRejectModal(user: any, content: any): void {
    this.selectedUser = user; // Stocker l'utilisateur sélectionné
    this.rejectForm.reset(); // Réinitialiser le formulaire
    this.modalService.open(content, { ariaLabelledBy: 'rejectUserModalLabel' });
  }
  onRejectSubmit(): void {
    if (this.rejectForm.valid && this.selectedUser) {
      const rejectionReason = this.rejectForm.value.rejectReason;
  
      this.authservice.rejectUser(this.selectedUser.idUser, rejectionReason).subscribe({
        next: (response) => {
          console.log('Utilisateur refusé avec succès:', response);
          this.showSuccessMessage('Instructor rejected successfully.');
  
          // Mettre à jour l'état de l'utilisateur dans la liste
         
          const userIndex = this.users.findIndex(user => user.idUser === this.selectedUser.idUser);
          if (userIndex !== -1) {
            this.users[userIndex].accepted = 0; // Mettre à jour le statut de l'utilisateur
          }
          this.modalService.dismissAll(); // Fermer la modale
        },
        error: (err) => {
          console.error('Erreur lors du refus de l\'utilisateur:', err);
          this.showErrorMessage(err.message || 'Une erreur s\'est produite lors du refus de l\'utilisateur.');
        }
      });
    }
  }
  openCvModal(user: any, content: any): void {
    console.log('Utilisateur sélectionné:', user); // Vérifie toutes les propriétés de l'utilisateur
  
    if (!user.cv) {
      console.warn('Aucun CV trouvé pour cet utilisateur:', user);
      alert('Cet utilisateur n’a pas encore ajouté de CV.');
      return;
    }
  
    this.authservice.getUserCV(user.cv).subscribe({
      next: (cvBlob) => {
        console.log('CV récupéré:', cvBlob);
  
        const cvUrl = URL.createObjectURL(cvBlob);
        this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cvUrl);
        this.modalService.open(content, { ariaLabelledBy: 'cvModalLabel' });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du CV:', err);
        alert('Impossible de charger le CV.');
      }
    });
  }
  
  
  

  // Pipe pour l'URL sécurisée
  safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  accept(idUser: number): void {
    this.authservice.acceptUser(idUser).subscribe({
      next: (response: any) => {
        if (response && response.status === 'error') {
          console.error('Erreur lors de l\'acceptation de l\'utilisateur:', response.message);
          this.showErrorMessage(response.message);
        } else {
          console.log('Instructor successfully accepted:', response);
          this.showSuccessMessage('Instructor successfully accepted.');
  
          // Mettre à jour l'état de l'utilisateur dans la liste
          const userIndex = this.users.findIndex(user => user.idUser === idUser);
          if (userIndex !== -1) {
            this.users[userIndex].accepted = 1; // Mettre à jour le statut de l'utilisateur
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors de l\'acceptation de l\'utilisateur:', err);
        this.showSuccessMessage('Instructor successfully accepted.');      }
    });
  }
  
  reject(idUser: number): void {
    const rejectionReason = prompt('Please enter the reason for rejection:');
    if (rejectionReason) {
      this.authservice.rejectUser(idUser, rejectionReason).subscribe({
        next: (response) => {
          console.log('User rejected successfully:', response);
          this.showSuccessMessage('User rejected successfully.');
  
          // Mettre à jour l'état de l'utilisateur dans la liste
          const userIndex = this.users.findIndex(user => user.idUser === idUser);
          if (userIndex !== -1) {
            this.users[userIndex].accepted = 0; // Mettre à jour le statut de l'utilisateur
          }
  
        },
        error: (err) => {
          console.error('Error while rejecting the user:', err);
          this.showErrorMessage(err.message || 'An error occurred while rejecting the user.');
        }
      });
    } else {
      this.showErrorMessage('Please enter a reason for rejection.');
    }
  }
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000); // Le message disparaît après 5 secondes
  }
  
  showErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
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
