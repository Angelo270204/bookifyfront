import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Output() loginSuccess = new EventEmitter<string[]>();

  isSubmitting = false;
  responseMessage = '';
  responseType: 'success' | 'error' | '' = '';

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]]
  });

  submitLogin(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.responseMessage = '';
    this.responseType = '';

    const payload = {
      correo: this.loginForm.value.correo?.trim() ?? '',
      contrasena: this.loginForm.value.contrasena ?? ''
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.exito) {
          this.loginForm.reset();
          if (response.usuarioId !== null) {
            localStorage.setItem('bookifyUserId', String(response.usuarioId));
          }
          if (response.correo) {
            localStorage.setItem('bookifyUserEmail', response.correo);
          }
          if (response.roles) {
            localStorage.setItem('bookifyUserRoles', JSON.stringify(response.roles));
          }
          this.responseMessage = '';
          this.responseType = '';
          this.loginSuccess.emit(response.roles || []);
        } else {
          this.responseMessage = response.mensaje;
          this.responseType = 'error';
          this.loginForm.markAllAsTouched();
        }
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.responseMessage =
          error.error?.mensaje ?? 'No fue posible iniciar sesion. Intenta nuevamente.';
        this.responseType = 'error';
        this.isSubmitting = false;
        this.loginForm.markAllAsTouched();
        this.cdr.detectChanges();
      }
    });
  }

  hasError(controlName: 'correo' | 'contrasena', errorKey: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.touched && control.hasError(errorKey);
  }
}
