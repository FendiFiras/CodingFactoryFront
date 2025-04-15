import { Component, OnInit } from '@angular/core';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonModule } from '@angular/common';
import { UserPreference } from 'src/app/models/user-preference';
import { UserPreferenceService } from 'src/app/services/user-preference.service';

@Component({
  selector: 'app-instructor',
  standalone: true, // Ajouté ici

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
    CommonModule
    
  ],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {
  newUser: User = new User();
  successMessage: string = '';
  errorMessage: string = '';
  Gender = Gender;
  errors: any = {};
  cvFile: File | null = null;
  selectedFile: File | null = null; // Pour stocker l’image sélectionnée
  imagePreview: string | ArrayBuffer | null = null;



  constructor(private authService: AuthService,  
        private userPreferenceService: UserPreferenceService
  
  ) {}
  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        const userId = user.idUser;
        this.userPreferenceService.getUserPreference(userId).subscribe({
          next: (pref) => {
            const body = document.body;
            body.classList.remove('light-mode', 'dark-mode');
            
            const theme = pref?.theme === 'dark' ? 'dark-mode' : 'light-mode';
            body.classList.add(theme);
          },
          error: (err) => {
            console.error("Erreur lors de la récupération des préférences :", err);
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    });
  }
  
  

  // Validation du formulaire
  validateForm(): boolean {
    this.errors = {}; // Réinitialiser les erreurs
    let valid = true;

    // Validation du prénom
    if (!this.newUser.firstName || !/^[A-Za-z\s]+$/.test(this.newUser.firstName)) {
      this.errors.firstName = 'First name is required and must contain only letters.';
      valid = false;
    }

    // Validation du nom
    if (!this.newUser.lastName || !/^[A-Za-z\s]+$/.test(this.newUser.lastName)) {
      this.errors.lastName = 'Last name is required and must contain only letters.';
      valid = false;
    }

    // Validation de l'email
    if (!this.newUser.email || !/^\S+@\S+\.\S+$/.test(this.newUser.email)) {
      this.errors.email = 'Invalid email address.';
      valid = false;
    }

    // Validation du numéro de téléphone
    if (!this.newUser.phoneNumber || !/^\d{8,15}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number.';
      valid = false;
    }

    // Validation de l'adresse
    if (!this.newUser.address) {
      this.errors.address = 'Address is required.';
      valid = false;
    }

    // Validation de la spécialité
    if (!this.newUser.speciality) {
      this.errors.speciality = 'Speciality is required.';
      valid = false;
    }

    // Validation du genre
    if (!this.newUser.gender) {
      this.errors.gender = 'Please select your gender.';
      valid = false;
    }

    // Validation de la date de naissance (au moins 25 ans)
    if (!this.newUser.dateOfBirth) {
      this.errors.dateOfBirth = 'Date of Birth is required.';
      valid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(this.newUser.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();

      if (age < 25 || (age === 25 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
        this.errors.dateOfBirth = 'You must be at least 25 years old to become an instructor.';
        valid = false;
      }
    
    }
    if (!this.cvFile) {
      this.errors.cv = 'CV is required.';
      valid = false;
    }
    
    return valid;
  }

  // Enregistrement de l'instructeur
  registerInstructor() {
    if (!this.validateForm()) {
      return;
    }
  
    this.newUser.role = Role.INSTRUCTOR;
    this.newUser.password = this.generateRandomPassword(); // Générer un mot de passe aléatoire
  
    // Créer un FormData pour envoyer les données avec le fichier
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
  
    formData.append('firstName', this.newUser.firstName);
    formData.append('lastName', this.newUser.lastName);
    formData.append('email', this.newUser.email);
    formData.append('phoneNumber', this.newUser.phoneNumber);
    formData.append('address', this.newUser.address);
    formData.append('speciality', this.newUser.speciality);
    formData.append('gender', this.newUser.gender);
    formData.append('role', this.newUser.role);
    formData.append('dateOfBirth', new Date(this.newUser.dateOfBirth).toISOString().split('T')[0]);
    formData.append('password', this.newUser.password); 
    formData.append('cv', this.cvFile, this.cvFile.name); // Ajout du fichier CV

   
  
    // Envoi des données au backend
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'Instructor registered successfully!';
        this.errorMessage = '';
        this.newUser = new User();
        this.cvFile = null; // Réinitialiser le fichier après l'envoi
        this.selectedFile = null;
        this.errors = {};
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register instructor. Please try again.';
      }
    });
  }
  
  generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  // Validation de l'email
  validateEmail(): void {
    if (!this.newUser.email) {
      this.errors.email = 'Email is required.';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.newUser.email)) {
      this.errors.email = 'Invalid email format.';
    } else {
      // Vérifier si l'e-mail existe déjà
      this.authService.checkEmailExists(this.newUser.email).subscribe({
        next: (emailExists) => {
          if (emailExists) {
            this.errors.email = 'Email already exists.'; // Afficher l'erreur si l'e-mail existe déjà
          } else {
            this.errors.email = ''; // Effacer l'erreur si l'e-mail est valide et n'existe pas
          }
        },
        error: (error) => {
          console.error('Error checking email:', error); // Logger l'erreur dans la console
          this.errors.email = 'An error occurred while checking the email.'; // Afficher un message d'erreur générique
        }
      });
    }
  }

  // Validation du prénom
  validateFirstName(): void {
    if (!this.newUser.firstName || !/^[A-Za-z\s]+$/.test(this.newUser.firstName)) {
      this.errors.firstName = 'First name is required and must contain only letters.';
    } else {
      this.errors.firstName = ''; // Effacer l'erreur si le prénom est valide
    }
  }

  // Validation du nom
  validateLastName(): void {
    if (!this.newUser.lastName || !/^[A-Za-z\s]+$/.test(this.newUser.lastName)) {
      this.errors.lastName = 'Last name is required and must contain only letters.';
    } else {
      this.errors.lastName = ''; // Effacer l'erreur si le nom est valide
    }
  }

  // Validation de la date de naissance
  validateDateOfBirth(): void {
    if (!this.newUser.dateOfBirth) {
      this.errors.dateOfBirth = 'Date of Birth is required.';
    } else {
      const today = new Date();
      const birthDate = new Date(this.newUser.dateOfBirth);

      if (birthDate > today) {
        this.errors.dateOfBirth = 'Date of Birth cannot be in the future.';
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        if (age < 25 || (age === 25 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
          this.errors.dateOfBirth = 'You must be at least 25 years old to become an instructor.';
        } else {
          this.errors.dateOfBirth = ''; // Effacer l'erreur si la date de naissance est valide
        }
      }
    }
  }

  // Validation de l'adresse
  validateAddress(): void {
    if (!this.newUser.address) {
      this.errors.address = 'Address is required.';
    } else {
      this.errors.address = ''; // Effacer l'erreur si l'adresse est valide
    }
  }

  // Validation du genre
  validateGender(): void {
    if (!this.newUser.gender) {
      this.errors.gender = 'Gender is required.';
    } else {
      this.errors.gender = ''; // Effacer l'erreur si le genre est valide
    }
  }

  // Validation du numéro de téléphone
  validatePhoneNumber(): void {
    if (!this.newUser.phoneNumber) {
      this.errors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{8,15}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number format. It must be 8 to 15 digits.';
    } else {
      this.errors.phoneNumber = ''; // Effacer l'erreur si le numéro de téléphone est valide
    }
  }

  // Validation de la spécialité
  validateSpeciality(): void {
    if (!this.newUser.speciality) {
      this.errors.speciality = 'Speciality is required.';
    } else {
      this.errors.speciality = ''; // Effacer l'erreur si la spécialité est valide
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérifier si le fichier est un PDF
      if (file.type !== 'application/pdf') {
        this.errors.cv = 'Only PDF files are allowed.';
        this.cvFile = null;
      } else if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        this.errors.cv = 'File size must be less than 2MB.';
        this.cvFile = null;
      } else {
        this.errors.cv = ''; // Effacer les erreurs si le fichier est valide
        this.cvFile = file;
      }
    }
  }
  
  
    
    if (file) {
      // Vérifier si le fichier est un PDF
      if (file.type !== 'application/pdf') {
        this.errors.cv = 'Only PDF files are allowed.';
        this.cvFile = null;
      } else if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        this.errors.cv = 'File size must be less than 2MB.';
        this.cvFile = null;
      } else {
        this.errors.cv = ''; // Effacer les erreurs si le fichier est valide
        this.cvFile = file;
      }
    }
      // Gérer la sélection de l’image
  onFileSelected2(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        this.selectedFile = file;
  
        // Afficher un aperçu de l’image
        const reader = new FileReader();
        reader.onload = (e) => this.imagePreview = e.target?.result;
        reader.readAsDataURL(file);
    } else {
        this.errors.image = 'Only JPG or PNG images are allowed.';
    }
}
  }
  