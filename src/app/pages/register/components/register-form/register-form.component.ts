import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @Output() registerSuccess = new EventEmitter<void>();

  isSubmitting = false;
  responseMessage = '';
  responseType: 'success' | 'error' | '' = '';

  registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]]
  });

  submitRegister(): void {
    if (this.registerForm.invalid || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.responseMessage = '';
    this.responseType = '';

    const payload = {
      nombre: this.registerForm.value.nombre?.trim() ?? '',
      correo: this.registerForm.value.correo?.trim() ?? '',
      contrasena: this.registerForm.value.contrasena ?? ''
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.responseMessage = response.mensaje;
        this.responseType = response.exito ? 'success' : 'error';
        this.isSubmitting = false;

        if (response.exito) {
          this.registerForm.reset();
          setTimeout(() => this.registerSuccess.emit(), 650);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.responseMessage =
          error.error?.mensaje ?? 'No fue posible registrar el usuario. Intenta nuevamente.';
        this.responseType = 'error';
        this.isSubmitting = false;
      }
    });
  }

  hasError(controlName: 'nombre' | 'correo' | 'contrasena', errorKey: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.touched && control.hasError(errorKey);
  }
}
