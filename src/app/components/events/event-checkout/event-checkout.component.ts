import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe],
  templateUrl: './event-checkout.component.html',
  styleUrls: ['./event-checkout.component.css']
})
export class EventCheckoutComponent {
  event: any;
  loading = true;
  paymentError = '';
  isLoading = false;
  currentUser: any;

  // Payment form
  cardNumber = '';
  cardName = '';
  expiryDate = '';
  cvv = '';
  email = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEvent(Number(eventId)).subscribe({
        next: (event: any) => {
          this.event = event;
          this.loading = false;
        },
        error: () => this.router.navigate(['/events'])
      });
    }
  }

  processPayment() {
    this.isLoading = true;
    this.paymentError = '';
  
    const eventId = this.route.snapshot.paramMap.get('id');
    const cardLastFour = this.cardNumber.replace(/\s/g, '').slice(-4);
    
    this.paymentService.processEventPayment(
      Number(eventId),
      this.currentUser.id,
      'CREDIT_CARD',
      cardLastFour
    ).subscribe({
      next: (response: any) => {
        this.router.navigate(['/events', this.event.id, 'ticket'], {
          state: { 
            paymentSuccess: true,
            ticketCode: response.ticketCode
          }
        });
      },
      error: (err) => {
        this.paymentError = err.error?.message || 'Payment failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardName || !this.email) {
      this.paymentError = 'Please fill all payment details';
      return false;
    }

    if (!this.isValidCardNumber()) {
      this.paymentError = 'Please enter a valid card number';
      return false;
    }

    if (!this.isValidExpiryDate()) {
      this.paymentError = 'Please enter a valid expiry date (MM/YY)';
      return false;
    }

    if (!this.isValidCVV()) {
      this.paymentError = 'Please enter a valid CVV (3-4 digits)';
      return false;
    }

    if (!this.isValidEmail()) {
      this.paymentError = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  private isValidCardNumber(): boolean {
    const cleaned = this.cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  }

  private isValidExpiryDate(): boolean {
    if (!/^\d{2}\/\d{2}$/.test(this.expiryDate)) return false;
    
    const [month, year] = this.expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (Number(year) < currentYear) return false;
    if (Number(year) === currentYear && Number(month) < currentMonth) return false;
    if (Number(month) > 12 || Number(month) < 1) return false;
    
    return true;
  }

  private isValidCVV(): boolean {
    return /^\d{3,4}$/.test(this.cvv);
  }

  private isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  formatCardNumber() {
    let numbers = this.cardNumber.replace(/\D/g, '');
    if (numbers.length > 16) {
      numbers = numbers.substring(0, 16);
    }
    
    // Format as XXXX XXXX XXXX XXXX
    this.cardNumber = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  formatExpiryDate() {
    let numbers = this.expiryDate.replace(/\D/g, '');
    if (numbers.length > 4) {
      numbers = numbers.substring(0, 4);
    }
    
    // Format as MM/YY
    if (numbers.length > 2) {
      this.expiryDate = numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    } else {
      this.expiryDate = numbers;
    }
  }
}