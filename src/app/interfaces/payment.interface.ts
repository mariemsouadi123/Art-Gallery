// src/app/interfaces/payment.interface.ts
export interface ArtworkBase {
  id: number;
  title: string;
}

export interface PaymentArtwork extends ArtworkBase {
  imageUrl: string;
  artist: string;
}

export interface UserBase {
  id: number;
  name: string;
  email: string;
}

export interface PaymentBase {
  id: number;
  amount: number;
  status: string;
  date: string;
}

export interface Payment extends PaymentBase {
  artwork: ArtworkBase;
}

export interface PaymentHistory extends PaymentBase {
  artwork: PaymentArtwork;
  user: UserBase;
  paymentMethod: string;
  transactionId: string;
}

export interface AdminPayment extends PaymentBase {
  artwork: {
    id: number;
    title: string;
    imageUrl: string;
  };
  user: UserBase;
  paymentMethod: string;
}

export interface PaymentApiResponse<T = AdminPayment> {
  success: boolean;
  payments: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  message?: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  payment: Payment;
  message?: string;
}