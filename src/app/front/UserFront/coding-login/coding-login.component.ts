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
  isOtpRequired: boolean = false;  // Indicateur pour savoir si l'OTP est requis
  otp: string = '';  // Ajout du champ OTP
  showRoleSelection: boolean = false; // Afficher le formulaire de choix de rôle
userEmail: string = ''; // Email de l'utilisateur
userFirstName: string = ''; // Prénom de l'utilisateur
userLastName: string = ''; // Nom de l'utilisateur
selectedRole: string = ''; // Rôle choisi par l'utilisateur
userImage: string = ''; // Photo de profil Google

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo(); // Charge les infos utilisateur si connecté

    // Configuration du callback pour Google Login
    (window as any).handleCredentialResponse = (response: any) => {
      this.handleGoogleResponse(response);
    };

    // Initialiser Google Login
    this.initGoogleLogin();
  }
  initGoogleLogin(): void {
    if (typeof google === 'undefined' || !google.accounts) {
      console.error("Google API non chargée.");
      return;
    }
    
    google.accounts.id.initialize({
      client_id: '297153804677-lou7tiqpeipefqo60c2cltqn400ki2st.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handleGoogleResponse(response);
      }
    });
  
    google.accounts.id.renderButton(
      document.getElementById('googleSignInBtn')!,
      { theme: 'outline', size: 'large' }
    );
  }
  

  handleGoogleResponse(response: any): void {
    console.log('Google Token:', response.credential);
  
    this.authService.googleLogin(response.credential).subscribe({
      next: (res) => {
        console.log('Réponse Backend:', res);
        
        if (!res.token) {
          console.error("Erreur: Aucun token reçu !");
          this.errorMessage = "Problème d'authentification. Veuillez réessayer.";
          return;
        }
  
        this.authService.saveToken(res.token);
  
        this.userEmail = res.email;
        this.userFirstName = res.firstName;
        this.userLastName = res.lastName;
        this.userImage = res.image;
  
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur Google Login:', err);
        this.errorMessage = "Erreur lors de la connexion avec Google.";
      }
    });
  }
  
  
  
// Fonction de connexion
login(): void {
  this.errorMessage = '';  // Réinitialiser le message d'erreur avant chaque tentative
  if (this.isOtpRequired) {
    this.verifyOtp();  // Vérifier l'OTP
  } else {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.loadUserInfo();
        this.isOtpRequired = true;  // OTP requis après la connexion
      },
      error: (err) => {
        this.errorMessage = err.message; 
      }
    });
  }
}








verifyOtp(): void {
  this.authService.verifyOtp(this.email, this.otp).subscribe({
    next: (response) => {
      this.authService.saveToken(response.token);
      this.router.navigate(['/home']);  // Rediriger après validation de l'OTP
    },
    error: (err) => {
      this.errorMessage = 'OTP invalide';
    }
  });
}
loadUserInfo(): void {
  if (!this.authService.isLoggedIn()) {
    return; // Évite un appel inutile
  }

  this.authService.getUserInfo().subscribe({
    next: (response) => {
      this.userInfo = response;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des informations utilisateur:', err);
    }
  });
}


  logout(): void {
    this.authService.logout();
    this.userInfo = null;  // Réinitialisation des données utilisateur
    this.router.navigate(['/login']); // Redirection après logout
  }
}
