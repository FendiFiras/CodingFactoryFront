import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-coding-register',
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
  constructor(private userService: UserService) {}
  registerUser() {
    // Convert the date to ISO 8601 format if it's a valid date
    if (this.newUser.dateOfBirth) {
      this.newUser.dateOfBirth = new Date(this.newUser.dateOfBirth).toISOString();
    }
  
    console.log("Tentative d'inscription avec :", this.newUser);
    console.log("Données envoyées au backend :", JSON.stringify(this.newUser));
  
    this.userService.registerUser(this.newUser).subscribe({
      next: (response) => {
        console.log("Réponse reçue :", response);
        this.successMessage = 'User registered successfully!';
        this.errorMessage = '';
        this.newUser = new User();  // Réinitialise le formulaire après succès
      },
      error: (error) => {
        console.error('Erreur d\'inscription :', error);
        this.errorMessage = error.error?.message || 'Failed to register user. Please try again.';
        this.successMessage = '';
      }
    });
  }
  
}
