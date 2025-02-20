import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, Gender, Role } from 'src/app/models/user';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';

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

  constructor(private userService: UserService) {}

  registerInstructor() {
    // Automatically set the role to INSTRUCTOR
    this.newUser.role = Role.INSTRUCTOR;
  
    // Convert date to ISO format
    if (this.newUser.dateOfBirth) {
      this.newUser.dateOfBirth = new Date(this.newUser.dateOfBirth).toISOString();
    }
  
    // Send user data to the backend
    this.userService.registerUser(this.newUser).subscribe({
      next: (response) => {
        console.log("Instructor registered successfully:", response);
        this.successMessage = 'Your request has been added.';
        this.errorMessage = '';
        this.newUser = new User();  // Reset form on success
      },
      error: (error) => {
        console.error('Error registering instructor:', error);
        this.errorMessage = error.error?.message || 'Failed to register instructor. Please try again.';
        this.successMessage = '';
      }
    });
  }
  
}
