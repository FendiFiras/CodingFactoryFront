import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, switchMap, map, catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedInObservable().pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return of(false);
        }
        return this.authService.getUserRole().pipe(
          map(role => {
            if (role === 'INSTRUCTOR') {
              return true;
            } else {
              this.router.navigate(['/home']);
              return false;
            }
          }),
          catchError(() => {
            this.router.navigate(['/home']);
            return of(false);
          })
        );
      })
    );
  }
}
