import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cartService = inject(CartService);
  paymentService = inject(PaymentService);
  authService = inject(AuthService);
  router = inject(Router);

  fullName: string = '';
  email: string = '';
  userId: number | null = null;
  paymentSuccess = false;
  isLoading = false;
  paymentMessage = '';
  paymentError = '';

  // Form variables
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.fullName = user.fullName; // Changed from full_name to fullName
        this.email = user.email;
        this.userId = user.id;
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  async processPayment() {
    this.isLoading = true;
    this.paymentError = '';

    if (!this.validateForm()) {
      this.isLoading = false;
      return;
    }

    if (!this.userId) {
      this.paymentError = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    try {
      // Process all items in cart sequentially
      for (const item of this.cartService.cartItems()) {
        await this.paymentService.processPayment(
          item.id, 
          this.userId, 
          item.price
        ).toPromise();
      }

      this.paymentSuccess = true;
      this.paymentMessage = 'Payment successful!';
      this.cartService.clearCart();
      
      setTimeout(() => this.router.navigate(['/user-home']), 2000);
    } catch (error: any) {
      console.error('Payment error:', error);
      this.paymentError = error.error?.message || 'Payment failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.cardNumber || !this.expiryDate || !this.cvv) {
      this.paymentError = 'Please fill all payment details';
      return false;
    }

    if (this.cardNumber.replace(/\s/g, '').length !== 16) {
      this.paymentError = 'Card number must be 16 digits';
      return false;
    }

    if (this.cvv.length !== 3) {
      this.paymentError = 'CVV must be 3 digits';
      return false;
    }

    if (this.cartService.cartItems().length === 0) {
      this.paymentError = 'Your cart is empty';
      return false;
    }

    return true;
  }
}