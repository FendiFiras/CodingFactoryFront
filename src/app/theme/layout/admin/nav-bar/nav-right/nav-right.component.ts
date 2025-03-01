
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  userInfo: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserInfo().subscribe({
        next: (response) => {
          this.userInfo = response;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.userInfo = null;
    this.router.navigate(['/login']);
  }
}

