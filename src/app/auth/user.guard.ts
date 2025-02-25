import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, map, catchError, of } from "rxjs";
import { AuthService } from "../services/auth-service.service";

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedInObservable().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          return true; // Les non-connectés peuvent accéder
        } else {
          this.router.navigate(['/home']); // Redirige les utilisateurs connectés vers home
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}
