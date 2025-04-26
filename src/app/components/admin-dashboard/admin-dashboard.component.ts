// src/app/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ArtworkService } from '../../services/artwork.service';
import { PaymentService } from '../../services/payment.service';


interface AdminStats {
  users: number;
  artworks: number;
  transactions: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  admin: { name: string, email: string, role: string, imageUrl?: string } | null = null;
  stats: AdminStats = {
    users: 0,
    artworks: 0,
    transactions: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private artworkService: ArtworkService,
    private paymentService: PaymentService
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
        role: user.role || 'Administrator',
        imageUrl: user.imageUrl
      };
    } else {
      this.authService.logout().subscribe();
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
    this.isLoading = false;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}