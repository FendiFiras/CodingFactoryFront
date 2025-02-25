import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth-service.service";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedInObservable().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(["/login"]); // Rediriger si non connecté
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(["/login"]);
        return of(false);
      })
    );
  }
}
