import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pago-container">
      <div class="icon-error">✖</div>
      <h1>Pago Rechazado</h1>
      <p>Lamentablemente no pudimos procesar tu pago. Por favor, verifica tu método de pago o intenta con otra tarjeta.</p>
      
      <div class="detalles" *ngIf="paymentId">
        <p><strong>ID de transacción:</strong> {{ paymentId }}</p>
      </div>

      <div class="acciones">
        <a routerLink="/" class="btn-primary">Volver al inicio</a>
      </div>
    </div>
  `,
  styles: [`
    .pago-container {
      max-width: 600px;
      margin: 4rem auto;
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .icon-error {
      font-size: 4rem;
      color: #ef4444;
      margin-bottom: 1rem;
    }
    h1 { color: #111827; margin-bottom: 1rem; }
    p { color: #4b5563; margin-bottom: 2rem; line-height: 1.6; }
    .detalles {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      p { margin: 0; color: #374151; font-family: monospace; }
    }
    .acciones {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn-primary {
      background: #111827; color: white;
      padding: 0.75rem 1.5rem; border-radius: 8px;
      text-decoration: none; font-weight: 500;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #374151; }
  `]
})
export class PagoFallidoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  paymentId: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || null;
    });
  }
}
