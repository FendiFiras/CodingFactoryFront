import { Component } from '@angular/core';
import { NavbarComponent } from '../elements/navbar/navbar.component';
import { FooterComponent } from '../elements/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true, // If using standalone components
  imports: [NavbarComponent,FooterComponent], // Import NavbarComponent here
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private router: Router) {}

  navigateToHome() {
    
    this.router.navigate(['/home']);
  }
}
