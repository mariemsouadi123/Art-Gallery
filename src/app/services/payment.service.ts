import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaymentResponse {
  message: string;
  payment: {
    id: number;
    artwork: {
      id: number;
      title: string;
    };
    amount: number;
    status: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) {}

  processPayment(artworkId: number, amount: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/process/${artworkId}`,
      { amount } 
    );
  }
}