import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-coding-register',
  standalone: true,
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './coding-register.component.html',
  styleUrls: ['./coding-register.component.scss']
})
export class CodingRegisterComponent {
  newUser: User = new User();
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null; // Ajout pour stocker l’image sélectionnée
  imagePreview: string | ArrayBuffer | null = null;
  Gender = Gender;
  Role = Role;
  errors: any = {};

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

  validateForm(): boolean {
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
      this.errors.email = 'Email is required';
      valid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.newUser.email)) {
      this.errors.email = 'Invalid email format';
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
    
    if (!this.newUser.dateOfBirth) {
      this.errors.dateOfBirth = 'Date of Birth is required';
      valid = false;
    }
    if (!this.newUser.gender) {
      this.errors.gender = 'Gender is required';
      valid = false;
    }
    if (!this.newUser.phoneNumber) {
      this.errors.phoneNumber = 'Phone Number is required';
      valid = false;
    } else if (!/^\d{8}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number format';
      valid = false;
    }
    if (!this.newUser.address) {
      this.errors.address = 'Address is required';
      valid = false;
    }
    if (!this.newUser.role) {
      this.errors.role = 'Role is required';
      valid = false;
    }
    if (this.newUser.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.newUser.dateOfBirth);
      if (birthDate > today) {
          this.errors.dateOfBirth = 'Date of Birth cannot be in the future';
          valid = false;
      }
  }
  
    return valid;
  }

  registerUser(): void {
    if (!this.validateForm()) {
      return;
    }
  
    const formData = new FormData();
    formData.append('firstName', this.newUser.firstName);
    formData.append('lastName', this.newUser.lastName);
    formData.append('email', this.newUser.email);
    formData.append('password', this.newUser.password);
    
    // Assurez-vous que `dateOfBirth` est bien un objet Date ou une chaîne ISO valide
    formData.append('dateOfBirth', new Date(this.newUser.dateOfBirth).toISOString().split('T')[0]); // format yyyy-MM-dd
    
    formData.append('gender', this.newUser.gender);
    formData.append('phoneNumber', this.newUser.phoneNumber);
    formData.append('address', this.newUser.address);
    formData.append('role', this.newUser.role);
  
    // Ajoute l'image si elle est présente
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
  
    // Passe formData directement dans le service
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'User registered successfully!';
        this.errorMessage = '';
        this.newUser = new User();
        this.selectedFile = null;
        this.imagePreview = null;
        this.errors = {};
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register user. Please try again.';
      }
    });
  }
}