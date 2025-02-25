import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth-service.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedInObservable', 'getUserRole']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is admin', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(true));
    authServiceMock.getUserRole.and.returnValue(of('ADMIN' as any));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect non-admin users to home', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(true));
    authServiceMock.getUserRole.and.returnValue(of('USER' as any));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      expect(result).toBe(false);
      done();
    });
  });

  it('should redirect non-logged-in users to login', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(false));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(false);
      done();
    });
  });

  it('should redirect to home if role fetch fails', (done) => {
    authServiceMock.isLoggedInObservable.and.returnValue(of(true));
    authServiceMock.getUserRole.and.returnValue(of(null)); // Simule une erreur

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      expect(result).toBe(false);
      done();
    });
  });
});
