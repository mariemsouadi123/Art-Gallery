// src/app/components/admin/payment-management/payment-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { RouterModule } from '@angular/router';
import { PaymentApiResponse, AdminPayment } from '../../interfaces/payment.interface';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit {
  payments: AdminPayment[] = [];
  isLoading = false;
  totalPayments = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    
    const paymentObservable = this.searchQuery.trim() ?
      this.paymentService.searchAdminPayments(this.searchQuery, this.currentPage, this.pageSize) :
      this.paymentService.getAllAdminPayments(this.currentPage, this.pageSize);

    paymentObservable.subscribe({
      next: (response) => {
        this.payments = response.payments as AdminPayment[];
        this.totalPayments = response.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPayments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPayments();
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalPayments / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'failed': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}