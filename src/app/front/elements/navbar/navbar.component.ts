import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserPreferenceService } from 'src/app/services/user-preference.service';
import { UserPreference } from 'src/app/models/user-preference';
import { Component, OnInit, ChangeDetectorRef, TemplateRef, NgModule } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ,SharedModule,NgbDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userInfo: any = null;  // Stocke l'utilisateur connecté
  editForm: FormGroup; // Formulaire de modification
  selectedUser: any; // Utilisateur sélectionné pour l'édition
  selectedImage: File | null = null;  // Image sélectionnée, avec type explicite
  userPreference: UserPreference | null = null; // Préférences de l'utilisateur
  preferenceForm: FormGroup;
  isDropdownOpen: boolean = false; // Contrôle l'état du dropdown
  selectedTab: string = 'preferences'; // Onglet par défaut
  passwordForm: FormGroup;



  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private userPreferenceService: UserPreferenceService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    
    private fb: FormBuilder

  ) {
    // Initialisation du formulaire utilisateur
    this.editForm = this.fb.group({
      idUser: [''],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', Validators.required],
      role: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
    });

    // Initialisation du formulaire des préférences utilisateur
    this.preferenceForm = this.fb.group({
      theme: ['', Validators.required],
      language: ['', Validators.required],
      notificationEnabled: []
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
  });
  }

  ngOnInit(): void {
    this.loadUserInfo();
    const savedTheme = localStorage.getItem('theme');
    console.log(`Thème récupéré depuis localStorage: ${savedTheme}`); // Vérifie la valeur

    if (savedTheme) {
        this.applyPreferences({ theme: savedTheme });
    } else {
        this.applyPreferences({ theme: 'light' }); // Par défaut
    }
}



  
  
  
  
  isLoggedIn(): boolean {
    return !!this.userInfo; // Vérifie si userInfo est défini
  }
  onChangePassword() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
  
    const formData = new FormData();
    formData.append('currentPassword', this.passwordForm.value.currentPassword);
    formData.append('newPassword', this.passwordForm.value.newPassword);
  
    console.log("Changement de mot de passe:", this.passwordForm.value);
  
    // Appeler la méthode changePassword du AuthService
    this.authService.updateUser(this.userInfo.idUser, formData).subscribe({
      next: (response) => {
        console.log('Mot de passe mis à jour avec succès:', response);
        alert('Mot de passe mis à jour !');
        
        // Fermer la modale après la mise à jour du mot de passe
        this.modalService.dismissAll();  // Ferme la modale actuelle
  
        this.router.navigate(['/home']);  // Reconnecter l'utilisateur
      },
      error: (err) => {
        console.error('Erreur lors de la modification du mot de passe:', err);
        alert('Une erreur est survenue lors de la mise à jour du mot de passe.');
      }
    });
  }
  
 

  /** Récupérer les informations de l'utilisateur connecté */
  loadUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (response) => {
          this.userInfo = response;
          console.log('User Info chargé:', this.userInfo);
          this.loadUserPreferences();
          this.cdr.markForCheck(); // Forcer le rafraîchissement de la vue
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
          this.userInfo = null; // ou une valeur par défaut
        }
      });
    } else {
      this.userInfo = null; // ou une valeur par défaut
    }
  }

  /** Récupérer les préférences de l'utilisateur connecté */
  loadUserPreferences(): void {
    if (this.userInfo) {
      this.userPreferenceService.getUserPreference(this.userInfo.idUser).subscribe({
        next: (preference) => {
          this.userPreference = preference;
          this.preferenceForm.patchValue(preference); // Appliquer au formulaire
          this.applyPreferences(preference); // Appliquer immédiatement
        },
        error: (err) => {
          if (err.status === 404) {
            console.warn('Aucune préférence trouvée.');
            this.userPreference = null;
            this.preferenceForm.reset();
            // Appliquer un thème par défaut
            this.applyPreferences({ theme: 'light' }); // ou 'dark' selon votre choix
          } else {
            this.handleError(err, 'Erreur lors du chargement des préférences.');
          }
        }
      });
    }
  }
  applyPreferences(preferences: any) {
    console.log('Appliquer les préférences:', preferences);
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
    this.cdr.detectChanges();
}

 /** Gérer les erreurs de manière centralisée */
  handleError(error: any, message: string): void {
    console.error(message, error);
    alert('Erreur : ' + message);  // Affichage d'un message utilisateur en français
  }

  /** Ouvrir la modale des préférences */
  openPreferenceModal(modal: TemplateRef<any>): void {
    this.modalService.open(modal, { centered: true });
  }

  /** Soumettre les préférences utilisateur */
  onPreferenceSubmit(): void {
    if (!this.userInfo || !this.userInfo.idUser) {
      console.error('Erreur: userInfo.idUser est undefined.');
      return;
    }

    if (this.preferenceForm.valid) {
      const updatedPreference: UserPreference = {
        ...this.preferenceForm.value,
        idPreference: this.userPreference?.idPreference || undefined
      };

      console.log('Préférence envoyée:', updatedPreference);

      const savePreference$ = updatedPreference.idPreference
        ? this.userPreferenceService.modifyUserPreference(updatedPreference)
        : this.userPreferenceService.addUserPreference(updatedPreference, this.userInfo.idUser);

      savePreference$.subscribe({
        next: (response) => {
          console.log('Préférences mises à jour:', response);
          this.userPreference = response;
          this.applyPreferences(response); // Appliquer immédiatement
          this.modalService.dismissAll();
          alert('Preferences updated successfully!');
        },
        error: (err) => this.handleError(err, 'Erreur lors de la mise à jour des préférences.')
      });
    } else {
      console.error('Formulaire invalide.');
    }
}

  
  /** Ouvrir la modale d'édition utilisateur */
  openEditModal(user: any, modal: TemplateRef<any>): void {
    this.selectedUser = user;
    this.editForm.patchValue(user);
    if (user.image) {
      this.selectedImage = user.image; // Si une image est présente, on l'affiche
    }
    this.modalService.open(modal, { centered: true });
  }
  
  /** Soumettre la modification de l'utilisateur */
  onSubmit(): void {
    if (this.editForm.valid) {
      const userId = this.editForm.value.idUser;
      const userData = this.editForm.value;
  
      const formData = new FormData();
      for (let key in userData) {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      }
  
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      this.authService.updateUser(userId, formData).subscribe({
        next: (response) => {
          console.log('Utilisateur mis à jour:', response);
          this.loadUserInfo(); // Recharger les informations de l'utilisateur
          this.loadUserPreferences();
          // Forcer le rafraîchissement de la vue
          this.cdr.markForCheck();
  
          // Fermer la modal
          this.modalService.dismissAll();
  
          alert('Profile updated successfully!');
        },
        error: (err) => {
          this.handleError(err, 'Erreur lors de la modification de l\'utilisateur.');
        }
      });
    } else {
      console.error('Formulaire invalide.');
    }
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.markForCheck(); // Forcer la détection des changements
  }
  
  /** Mettre à jour l'image de l'utilisateur */
  updateUserImage(): void {
    if (this.selectedImage && this.userInfo?.idUser) {
      this.authService.updateUserImage(this.userInfo.idUser, this.selectedImage).subscribe({
        next: (response) => {
          console.log('Image mise à jour:', response);
          this.userInfo.image = response.imagePath; // Mettre à jour l'image de l'utilisateur
          this.cdr.markForCheck(); // Forcer le rafraîchissement de la vue
          this.modalService.dismissAll();
          alert('Image updated successfully!'); // Message en anglais
        },
        error: (err) => {
          this.handleError(err, 'Erreur lors de la mise à jour de l\'image.');
        }
      });
    } else {
      console.error('Aucune image sélectionnée ou utilisateur non identifié.');
    }
  }
  
  /** Gérer la sélection d'une image */
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  /** Déconnexion de l'utilisateur */
  logout(): void {
    this.authService.logout();
    this.userInfo = null;
    this.router.navigate(['/login']);
  }

  /** Redirection vers la page de connexion */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}