import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pago-container">
      <div class="icon-success">✓</div>
      <h1>¡Pago Exitoso!</h1>
      <p>Tu compra se ha procesado correctamente y el libro ya está en tu biblioteca.</p>
      
      <div class="detalles" *ngIf="paymentId">
        <p><strong>ID de transacción:</strong> {{ paymentId }}</p>
      </div>

      <div class="acciones">
        <a routerLink="/" class="btn-primary">Ir a mi biblioteca</a>
        <a routerLink="/explorar" class="btn-secondary">Seguir explorando</a>
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
    .icon-success {
      font-size: 4rem;
      color: #10b981;
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
    .btn-secondary {
      background: white; color: #111827;
      border: 1px solid #d1d5db;
      padding: 0.75rem 1.5rem; border-radius: 8px;
      text-decoration: none; font-weight: 500;
      transition: background 0.2s;
    }
    .btn-secondary:hover { background: #f9fafb; }
  `]
})
export class PagoExitosoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  paymentId: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || null;
    });
  }
}
