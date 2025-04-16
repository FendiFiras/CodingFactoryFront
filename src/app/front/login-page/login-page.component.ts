import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../elements/navbar/navbar.component';
import { FooterComponent } from '../elements/footer/footer.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true, // If using standalone components
  imports: [NavbarComponent,FooterComponent], // Import NavbarComponent here
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router,private userService: UserService) {}

  navigateToHome() {
    
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    // Set the user ID once, e.g., from a login process or from a stored value
    this.userService.setUserId(1); // Replace with actual user ID
  }
}
