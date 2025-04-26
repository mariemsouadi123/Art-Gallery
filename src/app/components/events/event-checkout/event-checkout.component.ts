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
  registrationId: any;

  // Payment form
  cardNumber = '';
  expiryDate = '';
  cvv = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.registrationId = navigation?.extras.state?.['registrationId'];

    const eventId = this.route.snapshot.paramMap.get('id');
    this.eventService.getEvent(Number(eventId)).subscribe({
      next: (event: any) => {
        this.event = event;
        this.loading = false;
      },
      error: () => this.router.navigate(['/events'])
    });
  }

  processPayment() {
    this.isLoading = true;
    this.paymentError = '';

    if (!this.cardNumber || !this.expiryDate || !this.cvv) {
      this.paymentError = 'Please fill all payment details';
      this.isLoading = false;
      return;
    }

    const cardLastFour = this.cardNumber.replace(/\s/g, '').slice(-4);
    
    this.paymentService.processEventPayment(
      this.registrationId,
      'CREDIT_CARD',
      cardLastFour
    ).subscribe({
      next: () => this.router.navigate(['/events', this.event.id, 'ticket']),
      error: () => {
        this.paymentError = 'Payment failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  formatCardNumber() {
    this.cardNumber = this.cardNumber.replace(/\D/g, '');
    if (this.cardNumber.length > 16) {
      this.cardNumber = this.cardNumber.substring(0, 16);
    }
    this.cardNumber = this.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  formatExpiryDate() {
    this.expiryDate = this.expiryDate.replace(/\D/g, '');
    if (this.expiryDate.length > 2) {
      this.expiryDate = this.expiryDate.substring(0, 2) + '/' + 
                       this.expiryDate.substring(2, 4);
    }
  }
}