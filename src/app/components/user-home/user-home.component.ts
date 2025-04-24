import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';

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
  purchases: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'USER') {
      this.router.navigate(['/login']);
      return;
    }

    this.fullName = user.fullName;
    this.userImage = user.imageUrl || 'assets/default-profile.jpg';
    
    this.loadPurchases(user.id);
  }

  private loadPurchases(userId: number): void {
    this.paymentService.getUserPayments(userId).subscribe({
      next: (payments) => {
        this.purchases = payments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
        this.errorMessage = 'Failed to load purchases';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout error:', err)
    });
  }
}