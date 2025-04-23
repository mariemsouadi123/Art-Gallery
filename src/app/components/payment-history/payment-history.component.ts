import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { PaymentHistory } from '../../interfaces/payment.interface';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  payments: PaymentHistory[] = [];
  isLoading = true;
  error = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPaymentHistory();
  }
  private setupPaymentListener(): void {
    this.paymentService.payments$.subscribe(payments => {
      this.payments = payments;
      this.isLoading = false;
    });
  }
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-artwork.jpg';
    img.onerror = null;
  }

  loadPaymentHistory(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.paymentService.getPaymentHistory(user.id).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payment history';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}