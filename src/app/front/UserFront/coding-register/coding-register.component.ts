import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-coding-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule
  ],
  templateUrl: './coding-register.component.html',
  styleUrls: ['./coding-register.component.scss']
})
export class CodingRegisterComponent {
  newUser: User = new User();
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null; // Pour stocker l’image sélectionnée
  imagePreview: string | ArrayBuffer | null = null;
  Gender = Gender;
  Role = Role;
  errors: any = {};
  currentStep: number = 1; // Étape actuelle du formulaire
  confirmPassword: string = '';
  regions: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
    'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia',
    'La Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  


  constructor(private authService: AuthService) {}

  // Gérer la sélection de l’image
  onFileSelected(event: any): void {
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
  // Méthode pour passer à l'étape suivante
  nextStep(): void {
    if (this.currentStep === 1) {
      // Valider l'étape 1
      if (this.validateStep1()) {
        // Vérifier si l'e-mail existe déjà
        this.authService.checkEmailExists(this.newUser.email).subscribe({
          next: (emailExists) => {
            if (emailExists) {
              // Afficher l'erreur si l'e-mail existe déjà
              this.errors.email = 'Email already exists';
            } else {
              // Passer à l'étape suivante si l'e-mail n'existe pas
              this.currentStep = 2;
            }
          },
          error: (error) => {
            console.error('Error checking email:', error); // Logger l'erreur dans la console
            this.errorMessage = 'Email already exists.';
          }
        });
      }
    }
  }

  // Validation de l'étape 1
  validateStep1(): boolean {
    this.errors = {};
    let valid = true;

    if (!this.newUser.firstName || !/^[A-Za-z\s]+$/.test(this.newUser.firstName)) {
      this.errors.firstName = 'First name is required and must contain only letters.';
      valid = false;
    }

    if (!this.newUser.lastName || !/^[A-Za-z\s]+$/.test(this.newUser.lastName)) {
      this.errors.lastName = 'Last name is required and must contain only letters.';
      valid = false;
    }

    if (!this.newUser.email) {
      this.errors.email = 'Email is required.';
      valid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.newUser.email)) {
      this.errors.email = 'Invalid email format.';
      valid = false;
    }

    if (!this.newUser.password) {
      this.errors.password = 'Password is required.';
      valid = false;
    } else if (this.newUser.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters.';
      valid = false;
    } else if (!/[A-Z]/.test(this.newUser.password) || !/[a-z]/.test(this.newUser.password) || !/[0-9]/.test(this.newUser.password)) {
      this.errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
      valid = false;
    }
    if (!this.confirmPassword) {
      this.errors.confirmPassword = 'Confirm Password is required.';
      valid = false;
    } else if (this.confirmPassword !== this.newUser.password) {
      this.errors.confirmPassword = 'Passwords do not match.';
      valid = false;
    } else {
      this.errors.confirmPassword = ''; // Réinitialiser l'erreur
    }
  
    if (!this.newUser.dateOfBirth) {
      this.errors.dateOfBirth = 'Date of Birth is required.';
      valid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(this.newUser.dateOfBirth);

      // Vérifier que la date de naissance n'est pas dans le futur
      if (birthDate > today) {
        this.errors.dateOfBirth = 'Date of Birth cannot be in the future.';
        valid = false;
      } else {
        // Calculer l'âge
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        // Vérifier si l'utilisateur a moins de 18 ans
        if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
          this.errors.dateOfBirth = 'You must be at least 18 years old.';
          valid = false;
        }
      }
    }

    if (!this.newUser.gender) {
      this.errors.gender = 'Gender is required.';
      valid = false;
    }

    if (!this.newUser.role) {
      this.errors.role = 'Role is required.';
      valid = false;
    }

    return valid;
  }

  // Méthode pour soumettre le formulaire
  registerUser(): void {
    if (this.currentStep === 2 && this.validateStep2()) {
      const formData = new FormData();
      formData.append('firstName', this.newUser.firstName);
      formData.append('lastName', this.newUser.lastName);
      formData.append('email', this.newUser.email);
      formData.append('password', this.newUser.password);
      formData.append('dateOfBirth', new Date(this.newUser.dateOfBirth).toISOString().split('T')[0]);
      formData.append('gender', this.newUser.gender);
      formData.append('role', this.newUser.role);

      if (this.newUser.role === Role.STUDENT) {
        formData.append('level', this.newUser.level);
        formData.append('phoneNumber', this.newUser.phoneNumber);
        formData.append('region', this.newUser.region); 
        formData.append('address', this.newUser.address);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
      } else if (this.newUser.role === Role.COMPANYREPRESENTIVE) {
        formData.append('companyName', this.newUser.companyName);
        formData.append('grade', this.newUser.grade);
        formData.append('phoneNumber', this.newUser.phoneNumber);
        formData.append('region', this.newUser.region); 
        formData.append('address', this.newUser.address);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.successMessage = response?.message || 'User registered successfully!';
          this.errorMessage = '';
          this.newUser = new User();
          this.selectedFile = null;
          this.imagePreview = null;
          this.errors = {};
          this.currentStep = 1; // Réinitialiser l'étape
        },
        error: (error) => {
          console.error('Error response:', error); // Ajoutez ce log pour déboguer
          if (error.error?.error === "Email already exists") {
            this.errors.email = "Email already exists"; // Afficher sous le champ email
          } else {
            this.errorMessage = error.error?.error || 'Failed to register user. Please try again.';
          }
        }
      });
    }
  }

  // Validation de l'e-mail en temps réel
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
          this.errors.email = 'Email already exists.'; // Afficher un message d'erreur générique
        }
      });
    }
  }

  // Validation du mot de passe en temps réel
  validatePassword(): void {
    if (!this.newUser.password) {
      this.errors.password = 'Password is required.';
    } else if (this.newUser.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters.';
    } else if (!/[A-Z]/.test(this.newUser.password) || !/[a-z]/.test(this.newUser.password) || !/[0-9]/.test(this.newUser.password)) {
      this.errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
    } else {
      this.errors.password = ''; // Effacer l'erreur si le mot de passe est valide
    }
  }

  // Validation du prénom en temps réel
  validateFirstName(): void {
    if (!this.newUser.firstName || !/^[A-Za-z\s]+$/.test(this.newUser.firstName)) {
      this.errors.firstName = 'First name is required and must contain only letters.';
    } else {
      this.errors.firstName = ''; // Effacer l'erreur si le prénom est valide
    }
  }

  // Validation du nom en temps réel
  validateLastName(): void {
    if (!this.newUser.lastName || !/^[A-Za-z\s]+$/.test(this.newUser.lastName)) {
      this.errors.lastName = 'Last name is required and must contain only letters.';
    } else {
      this.errors.lastName = ''; // Effacer l'erreur si le nom est valide
    }
  }

  // Validation de la date de naissance en temps réel
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

        if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
          this.errors.dateOfBirth = 'You must be at least 18 years old.';
        } else {
          this.errors.dateOfBirth = ''; // Effacer l'erreur si la date de naissance est valide
        }
      }
    }
  }

  // Validation du genre en temps réel
  validateGender(): void {
    if (!this.newUser.gender) {
      this.errors.gender = 'Gender is required.';
    } else {
      this.errors.gender = ''; // Effacer l'erreur si le genre est valide
    }
  }
  validateRegion(): void {
    if (!this.newUser.gender) {
      this.errors.gender = 'Governate is required.';
    } else {
      this.errors.gender = ''; 
    }
  }
  // Validation du rôle en temps réel
  validateRole(): void {
    if (!this.newUser.role) {
      this.errors.role = 'Role is required.';
    } else {
      this.errors.role = ''; // Effacer l'erreur si le rôle est valide
    }
  }
  validateLevel(): void {
    if (this.newUser.role === Role.STUDENT && !this.newUser.level) {
      this.errors.level = 'Level is required for students.';
    } else {
      this.errors.level = ''; // Effacer l'erreur si le niveau est valide
    }
  }
  validateCompanyName(): void {
    if (this.newUser.role === Role.COMPANYREPRESENTIVE && !this.newUser.companyName) {
      this.errors.companyName = 'Company Name is required .';
    } else {
      this.errors.companyName = ''; // Effacer l'erreur si le nom de l'entreprise est valide
    }
  }
  validateGrade(): void {
    if (this.newUser.role === Role.COMPANYREPRESENTIVE && !this.newUser.grade) {
      this.errors.grade = 'Grade is required .';
    } else {
      this.errors.grade = ''; // Effacer l'erreur si le grade est valide
    }
  }
  validatePhoneNumber(): void {
    if (!this.newUser.phoneNumber) {
      this.errors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{8}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number format. It must be 8 digits.';
    } else {
      this.errors.phoneNumber = ''; // Effacer l'erreur si le numéro de téléphone est valide
    }
  }
  validateAddress(): void {
    if (!this.newUser.address) {
      this.errors.address = 'Address is required.';
    } else {
      this.errors.address = ''; // Effacer l'erreur si l'adresse est valide
    }
  }
  validateConfirmPassword(): void {
    if (!this.confirmPassword) {
      this.errors.confirmPassword = 'Confirm Password is required.';
    } else if (this.confirmPassword !== this.newUser.password) {
      this.errors.confirmPassword = 'Passwords do not match.';
    } else {
      this.errors.confirmPassword = ''; // Effacer l'erreur si la confirmation est correcte
    }
  }
  
  
  // Validation de l'étape 2
  validateStep2(): boolean {
    this.errors = {};
    let valid = true;

    if (this.newUser.role === Role.STUDENT) {
      if (!this.newUser.level) {
        this.errors.level = 'Level is required.';
        valid = false;
      }
    } else if (this.newUser.role === Role.COMPANYREPRESENTIVE) {
      if (!this.newUser.companyName) {
        this.errors.companyName = 'Company Name is required.';
        valid = false;
      }
      if (!this.newUser.grade) {
        this.errors.grade = 'Grade is required.';
        valid = false;
      }
    }

    if (!this.newUser.phoneNumber) {
      this.errors.phoneNumber = 'Phone Number is required.';
      valid = false;
    } else if (!/^\d{8}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number format.';
      valid = false;
    }

    if (!this.newUser.address) {
      this.errors.address = 'Address is required.';
      valid = false;
    }

    // Validation de l'image (obligatoire)
    if (!this.selectedFile) {
      this.errors.image = ' Picture  is required.';
      valid = false;
    }
    if (!this.newUser.region) {
      this.errors.region = ' Governorate is required.';
      valid = false;
    }
    return valid;
  }
}