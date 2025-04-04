import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

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
  router = inject(Router);

  fullName: string | null = null;
  email: string | null = null;
  paymentSuccess = false;
  isLoading = false;
  paymentMessage = '';
  paymentError = '';

  // Form variables for payment details
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.fullName = user.full_name;
        this.email = user.email;
      }
    }
  }

  processPayment() {
    this.isLoading = true;
    this.paymentError = '';

    // Validate form
    if (!this.validateForm()) {
      this.isLoading = false;
      return;
    }

    // Process each item in cart
    const paymentPromises = this.cartService.cartItems().map(item => 
      this.paymentService.processPayment(item.id, item.price).toPromise()
    );

    Promise.all(paymentPromises)
      .then((responses) => {
        this.handlePaymentSuccess(responses);
      })
      .catch(error => {
        this.handlePaymentError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private validateForm(): boolean {
    if (!this.cardNumber || !this.expiryDate || !this.cvv) {
      this.paymentError = 'Please fill all payment details';
      return false;
    }

    if (this.cartService.cartItems().length === 0) {
      this.paymentError = 'Your cart is empty';
      return false;
    }

    return true;
  }

  private handlePaymentSuccess(responses: any[]) {
    this.paymentSuccess = true;
    this.paymentMessage = 'Payment successful!';
    
    // Save purchases to local storage
    this.savePurchases(responses);
    
    // Clear cart
    this.cartService.clearCart();
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/user-home']);
    }, 2000);
  }

  private handlePaymentError(error: any) {
    console.error('Payment error:', error);
    this.paymentError = error.error?.message || 'Payment failed. Please try again.';
  }

  private savePurchases(responses: any[]) {
    if (typeof window !== 'undefined') {
      const storedPurchases = localStorage.getItem('purchases');
      let purchases = storedPurchases ? JSON.parse(storedPurchases) : [];

      responses.forEach(response => {
        if (response?.payment) {
          purchases.push({
            artworkId: response.payment.artwork.id,
            title: response.payment.artwork.title,
            amount: response.payment.amount,
            date: new Date().toISOString()
          });
        }
      });

      localStorage.setItem('purchases', JSON.stringify(purchases));
    }
  }
}