import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-passwd',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './forget-passwd.component.html',
  styleUrls: ['./forget-passwd.component.scss']
})
export class ForgetPasswdComponent {
  step = 1;
  emailForm: FormGroup;
  otpForm: FormGroup;
  resetPasswordForm: FormGroup;
  tempToken: string = '';
  loading = false;
  resendTimer = 60;
  resendInterval: any;
  showPassword = false;
  otpDigits: string[] = Array(6).fill('');
  obscuredEmail = '';
  resetSuccess = false;
  phoneNumber: string = '';
  obscuredPhone: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator()
      ]]
    });
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      
      return !(hasUpperCase && hasNumber) ? { passwordStrength: true } : null;
    };
  }

  get hasMinLength() {
    return this.resetPasswordForm.get('newPassword')?.value?.length >= 8;
  }

  get hasUpperCase() {
    return /[A-Z]/.test(this.resetPasswordForm.get('newPassword')?.value);
  }

  get hasNumber() {
    return /[0-9]/.test(this.resetPasswordForm.get('newPassword')?.value);
  }

  getPasswordStrengthClass(): string {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    if (!password) return '';

    if (password.length < 8) return 'weak';
    if (!this.hasUpperCase || !this.hasNumber) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrengthClass();
    return strength === 'weak' ? 'Faible' : 
           strength === 'medium' ? 'Moyen' : 'Fort';
  }

  sendOtp() {
    if (this.emailForm.invalid) return;

    this.loading = true;
    const email = this.emailForm.value.email;
  this.phoneNumber = '+21627163524'; 
  this.obscuredPhone = this.obscurePhoneNumber(this.phoneNumber);
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastr.success('Code OTP envoyé avec succès');
        this.step = 2;
        this.startResendTimer();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || "Échec de l'envoi du code");
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  obscurePhoneNumber(phone: string): string {
    if (!phone) return '';
    
    if (phone.startsWith('+')) {
      const countryCode = phone.substring(0, 4); // +216
      const last3 = phone.substring(phone.length - 3);
      return `${countryCode}*****${last3}`;
    }
    
    if (phone.length > 4) {
      const visiblePart = phone.substring(phone.length - 4);
      return `****${visiblePart}`;
    }
    
    return phone; // Retourne tel quel si trop court
  }
  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.loading = true;
    const email = this.emailForm.value.email;
    const otp = this.otpForm.value.otp;
    
    this.authService.verifySms(email, otp).subscribe({
      next: (response) => {
        this.tempToken = response.token;
        this.step = 3;
        this.loading = false;
        clearInterval(this.resendInterval);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Code OTP invalide');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.toastr.error('Le mot de passe doit contenir 8 caractères minimum avec une majuscule et un chiffre');
      return;
    }

    this.loading = true;
    const newPassword = this.resetPasswordForm.value.newPassword;
  
    this.authService.resetPassword(newPassword, this.tempToken).subscribe({
      next: () => {
        this.resetSuccess = true;
        this.toastr.success('Mot de passe réinitialisé');
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Échec de la réinitialisation');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  moveToNext(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    
    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(`input[type="text"]:nth-child(${index + 2})`) as HTMLInputElement;
      nextInput?.focus();
    }
    
    this.otpForm.patchValue({
      otp: this.otpDigits.join('')
    });
    this.cdr.detectChanges();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.querySelector(`input[type="text"]:nth-child(${index})`) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  resendOtp() {
    if (this.resendTimer > 0) return;
    
    this.loading = true;
    const email = this.emailForm.value.email;
    
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.toastr.success('Nouveau code envoyé');
        this.resendTimer = 60;
        this.startResendTimer();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || "Échec de l'envoi");
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startResendTimer() {
    clearInterval(this.resendInterval);
    this.resendInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.resendInterval);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  obscureEmail(email: string): string {
    const [name, domain] = email.split('@');
    const obscuredName = name.length > 3 
      ? name.substring(0, 3) + '*'.repeat(name.length - 3)
      : '*'.repeat(name.length);
    return `${obscuredName}@${domain}`;
  }

  ngOnDestroy() {
    clearInterval(this.resendInterval);
  }
}