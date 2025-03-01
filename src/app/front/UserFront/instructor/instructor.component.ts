import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-instructor',
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,NavbarComponent,FooterComponent
  ],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent {
  newUser: User = new User();
  successMessage: string = '';
  errorMessage: string = '';
  Gender = Gender;
  errors: any = {};

  constructor(private authService: AuthService) {}

  validateForm(): boolean {
    this.errors = {}; // Reset errors
    let valid = true;

    if (!this.newUser.firstName || !/^[A-Za-z\s]+$/.test(this.newUser.firstName)) {
      this.errors.firstName = 'First name is required and must contain only letters.';
      valid = false;
    }

    if (!this.newUser.lastName || !/^[A-Za-z\s]+$/.test(this.newUser.lastName)) {
      this.errors.lastName = 'Last name is required and must contain only letters.';
      valid = false;
    }

    if (!this.newUser.email || !/^\S+@\S+\.\S+$/.test(this.newUser.email)) {
      this.errors.email = 'Invalid email address.';
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

    if (!this.newUser.phoneNumber || !/^\d{8,15}$/.test(this.newUser.phoneNumber)) {
      this.errors.phoneNumber = 'Invalid phone number.';
      valid = false;
    }

    if (!this.newUser.address) {
      this.errors.address = 'Address is required.';
      valid = false;
    }

    if (!this.newUser.speciality) {
      this.errors.speciality = 'Speciality is required.';
      valid = false;
    }

    if (!this.newUser.gender) {
      this.errors.gender = 'Please select your gender.';
      valid = false;
    }

    return valid;
  }

  registerInstructor() {
    if (!this.validateForm()) {
      return;
    }
  
    this.newUser.role = Role.INSTRUCTOR;
  
    if (this.newUser.dateOfBirth) {
      this.newUser.dateOfBirth = new Date(this.newUser.dateOfBirth).toISOString(); // S'assurer que la date est correcte
    }
  
    // Créer un FormData
    const formData = new FormData();
    formData.append('firstName', this.newUser.firstName);
    formData.append('lastName', this.newUser.lastName);
    formData.append('email', this.newUser.email);
    formData.append('password', this.newUser.password);
    formData.append('phoneNumber', this.newUser.phoneNumber);
    formData.append('address', this.newUser.address);
    formData.append('speciality', this.newUser.speciality);
    formData.append('gender', this.newUser.gender);
    formData.append('role', this.newUser.role);
    formData.append('dateOfBirth', this.newUser.dateOfBirth);
  
    // Si tu as une image à envoyer, il faudrait l'ajouter à FormData (si applicable)
    // formData.append('image', this.selectedFile, this.selectedFile.name);  // Si une image est disponible
  
    // Envoi des données sous forme de FormData
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'Instructor registered successfully!';
        this.errorMessage = '';
        this.newUser = new User();
        this.errors = {};
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register instructor. Please try again.';
      }
    });
  }
}  