// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Payment,
  PaymentHistory,
  AdminPayment,
  ProcessPaymentResponse,
  PaymentApiResponse
} from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/payments';
  private paymentsSubject = new BehaviorSubject<PaymentHistory[]>([]);
  payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Existing methods remain unchanged
  processPayment(
    artworkId: number, 
    userId: number, 
    amount: number
  ): Observable<ProcessPaymentResponse> {
    return this.http.post<ProcessPaymentResponse>(
      `${this.apiUrl}/process`,
      { artworkId, userId, amount },
      { withCredentials: true }
    );
  }

  getUserPayments(userId: number): Observable<Payment[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.http.get<Payment[]>(
      `${this.apiUrl}/user/${userId}`,
      { withCredentials: true }
    ).pipe(
      tap(() => this.refreshPayments(userId))
    );
  }

  refreshPayments(userId: number): void {
    this.getPaymentHistory(userId).subscribe({
      next: (payments) => this.paymentsSubject.next(payments),
      error: (err) => console.error('Error refreshing payments:', err)
    });
  }

  getPaymentHistory(userId: number): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(
      `${this.apiUrl}/user/${userId}/history`,
      { withCredentials: true }
    );
  }

  // New admin methods
  getAllAdminPayments(page: number = 1, size: number = 10): Observable<PaymentApiResponse> {
    const params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', size.toString());

    return this.http.get<PaymentApiResponse>(
      `${this.apiUrl}/admin`,
      { params, withCredentials: true }
    );
  }

  searchAdminPayments(query: string, page: number = 1, size: number = 10): Observable<PaymentApiResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', (page - 1).toString())
      .set('size', size.toString());

    return this.http.get<PaymentApiResponse>(
      `${this.apiUrl}/admin/search`,
      { params, withCredentials: true }
    );
  }
  // Add to your payment.service.ts
  getTransactionsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true });
  }
}