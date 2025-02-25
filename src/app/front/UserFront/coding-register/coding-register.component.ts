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
  Gender = Gender;
  Role = Role;
  errors: any = {};

  constructor(private authService: AuthService) {}

  validateForm(): boolean {
    this.errors = {};
    let valid = true;

    if (!this.newUser.firstName) {
      this.errors.firstName = 'First Name is required';
      valid = false;
    }
    if (!this.newUser.lastName) {
      this.errors.lastName = 'Last Name is required';
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
      this.errors.password = 'Password is required';
      valid = false;
    } else if (this.newUser.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (!/[A-Z]/.test(this.newUser.password)) {
      this.errors.password = 'Password must contain at least one uppercase letter';
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

    return valid;
  }

  registerUser() {
    if (!this.validateForm()) {
      return;
    }

    if (this.newUser.dateOfBirth) {
      this.newUser.dateOfBirth = new Date(this.newUser.dateOfBirth).toISOString();
    }

    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'User registered successfully!';
        this.errorMessage = '';
        this.newUser = new User();
        this.errors = {};
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to register user. Please try again.';
      }
    });
  }
}
