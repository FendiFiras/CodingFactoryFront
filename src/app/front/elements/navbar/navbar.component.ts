import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service'; // Importez le service UserService

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userInfo: any = null;  // Stocke l'utilisateur connecté
  isEditing: boolean = false; // Pour basculer entre l'affichage et l'édition
  editedUser: any = {}; // Stocke les modifications de l'utilisateur

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService // Injectez le service UserService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (response) => {
          this.userInfo = response;  // Met à jour les infos utilisateur
          this.editedUser = { ...response }; // Copie les infos pour l'édition
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.userInfo = null;  // Réinitialisation des données utilisateur
    this.router.navigate(['/login']); // Redirection après logout
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing; // Bascule entre l'affichage et l'édition
  }

  saveChanges(): void {
    this.userService.modifyUser(this.editedUser).subscribe({
      next: (response) => {
        this.userInfo = response; // Met à jour les infos utilisateur
        this.isEditing = false; // Désactive le mode édition
      },
      error: (err) => {
        console.error('Erreur lors de la modification des informations utilisateur:', err);
      }
    });
  }
} 