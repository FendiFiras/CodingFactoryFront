import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from "../../../theme/layout/admin/nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-navbar',
  standalone: true, // If using standalone components
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: []
})
export class NavbarComponent {



  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
 }
