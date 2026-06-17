import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-simulador-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './simulador-pago.component.html',
  styleUrls: ['./simulador-pago.component.scss']
})
export class SimuladorPagoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private compraService = inject(CompraService);

  pagoForm!: FormGroup;
  preferenceId: string | null = null;
  procesando = false;
  errorMensaje: string | null = null;

  ngOnInit(): void {
    this.preferenceId = this.route.snapshot.paramMap.get('preferenceId');
    if (!this.preferenceId) {
      this.router.navigate(['/']);
      return;
    }

    this.pagoForm = this.fb.group({
      numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      nombreTitular: ['', [Validators.required, Validators.minLength(3)]],
      fechaExpiracion: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  get f() {
    return this.pagoForm.controls;
  }

  procesarPago(): void {
    if (this.pagoForm.invalid || !this.preferenceId) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    this.procesando = true;
    this.errorMensaje = null;

    // Simulamos un pequeño delay de procesamiento para hacerlo más realista
    setTimeout(() => {
      this.compraService.simularPago(this.preferenceId!).subscribe({
        next: () => {
          this.procesando = false;
          // Generar un ID de transacción numérico aleatorio (ej. 10 dígitos) para simular un pago real
          const trxId = Math.floor(Math.random() * 9000000000) + 1000000000;
          this.router.navigate(['/pago-exitoso'], { queryParams: { payment_id: trxId } });
        },
        error: (err) => {
          console.error('Error simulando pago:', err);
          this.errorMensaje = 'Hubo un error al procesar tu tarjeta. Intenta nuevamente.';
          this.procesando = false;
        }
      });
    }, 1500);
  }
}
