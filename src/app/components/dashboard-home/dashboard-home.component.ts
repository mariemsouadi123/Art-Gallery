// src/app/components/dashboard-home/dashboard-home.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ArtworkService } from '../../services/artwork.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  isLoading = true;
  stats = {
    users: 0,
    artworks: 0,
    transactions: 0
  };
  admin: any = null;

  constructor(
    private userService: UserService,
    private artworkService: ArtworkService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAdminProfile();
    this.loadStatistics();
  }

  private loadAdminProfile(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.admin = {
        name: user.fullName || 'Admin',
        email: user.email,
        role: user.role || 'Administrator'
      };
    }
  }

  private loadStatistics(): void {
    this.isLoading = true;

    // Load user count
    this.userService.getUsersCount().subscribe({
      next: (count) => {
        this.stats.users = count;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading user count:', err);
        this.stats.users = 0;
        this.checkLoadingComplete();
      }
    });

    // Load artwork count
    this.artworkService.getArtworksCount().subscribe({
      next: (count) => {
        this.stats.artworks = count;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading artwork count:', err);
        this.stats.artworks = 0;
        this.checkLoadingComplete();
      }
    });

    // Load transaction count
    this.paymentService.getTransactionsCount().subscribe({
      next: (count) => {
        this.stats.transactions = count;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading transaction count:', err);
        this.stats.transactions = 0;
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // We'll consider loading complete when all three stats have been attempted
    this.isLoading = false;
  }
}