import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BanLogService } from 'src/app/services/banlog.service'; // Service de gestion des bans
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BanLog, Status } from 'src/app/models/ban-log';

@Component({
  selector: 'app-instructor',
  imports: [SharedModule],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {
  users: any[] = []; // Liste des instructeurs
  editForm: FormGroup; // Formulaire pour modifier un utilisateur
  banForm: FormGroup; // Formulaire pour bannir un utilisateur
  selectedUser: any; // Utilisateur sélectionné pour modification
  selectedBanUser: any; // Utilisateur sélectionné pour bannissement

  constructor(
    private userService: UserService,
    private banLogService: BanLogService, // Injection du service BanLog
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
   

   // Initialisation du formulaire de bannissement avec validation
   this.banForm = this.fb.group({
    banDuration: ['', [Validators.required, this.minimumBanDurationValidator]], // Validation personnalisée
    banReason: ['', Validators.required],
    status: [Status.ACTIVE]
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
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
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
