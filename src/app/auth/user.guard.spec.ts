import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserGuard } from './user.guard';
import { AuthService } from '../services/auth-service.service';

describe('UserGuard', () => {
  let guard: UserGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedInObservable']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        UserGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(UserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is not logged in', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(false));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect logged-in user to /home', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(true));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      expect(result).toBe(false);
      done();
    });
  });
});
