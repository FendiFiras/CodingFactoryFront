import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, // If using standalone components
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {



  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToTrainingList() {
    this.router.navigate(['/TrainingList']);
  }
  navigateToCourses() {
    this.router.navigate(['/CoursesManagement']);
  }
 }
