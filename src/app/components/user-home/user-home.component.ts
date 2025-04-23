import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';

interface Purchase {
  artworkId: number;
  title: string;
  amount: number;
  date: Date;
  imageUrl?: string;
}

interface PaymentResponse {
  id: number;
  amount: number;
  date: string;
  artwork?: {
    id: number;
    title: string;
    imageUrl?: string;
  };
}

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  fullName: string = '';
  userImage: string = 'assets/default-profile.jpg';
  purchases: Purchase[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verifyUserSession();
    this.authService.getCurrentUserObservable().subscribe(user => {
      if (user) {
        this.fullName = user.fullName;
        this.userImage = user.imageUrl || 'assets/default-profile.jpg';
      }
    });
  }

  private verifyUserSession(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.handleInvalidUser();
      return;
    }

    // Use the correct property names that match your User interface
    this.fullName = user.fullName; // Changed from full_name to fullName
    this.userImage = user.imageUrl || 'assets/default-profile.jpg';
    this.isLoading = false;

    if (user.id) {
      this.loadPurchases(user.id);
    } else {
      this.handleInvalidUser();
    }
  }

  private handleInvalidUser(): void {
    this.errorMessage = 'Invalid session. Please login again.';
    this.isLoading = false;
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout error:', err)
    });
  }
  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/default-profile.jpg';
  }
  private loadPurchases(userId: number): void {
    this.paymentService.getUserPayments(userId).subscribe({
      next: (payments: PaymentResponse[]) => {
        this.purchases = payments.map(payment => ({
          artworkId: payment.artwork?.id || 0,
          title: payment.artwork?.title || 'Unknown Artwork',
          amount: payment.amount || 0,
          date: payment.date ? new Date(payment.date) : new Date(),
          imageUrl: payment.artwork?.imageUrl || 'assets/default-artwork.jpg'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'No purchases found';
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Error loading purchase history. Please try again later.';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}