import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../elements/footer/footer.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-coding-login',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './coding-login.component.html',
  styleUrls: ['./coding-login.component.scss']
})
export class CodingLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userInfo: any = null;  // Stocke l'utilisateur connecté

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo(); // Charge les infos utilisateur si connecté
  }

  login(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);  // Sauvegarde du token
        this.loadUserInfo();  // Récupération des infos utilisateur après connexion
        
        // Vérifie le rôle de l'utilisateur
        this.authService.getUserRole().subscribe({
          next: (role) => {
            // Redirige selon le rôle
            if (role === 'ADMIN') {
              this.router.navigate(['/dashboard']);  // Rediriger vers la page admin
            } else {
              this.router.navigate(['/home']);  // Rediriger vers la page d'accueil
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du rôle :', err);
            this.router.navigate(['/home']);
          }
        });
      },
      error: () => {
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    });
  }

  loadUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (response) => {
          this.userInfo = response;  // Met à jour les infos utilisateur
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
}
