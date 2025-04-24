import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

 export interface PaymentNotification {
  paymentId: number;
  message: string;
  amount: number;
  date: string;
  artworkTitle: string; // Supprimé cardLastFour
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: any;
  private notificationSubject = new BehaviorSubject<PaymentNotification | null>(null);
  public notification$ = this.notificationSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    if (!this.isBrowser) return;

    const ws = new SockJS('http://localhost:8080/ws-payments');
    this.stompClient = Stomp.over(ws);
    
    this.stompClient.connect({}, () => {
      this.authService.getCurrentUserObservable().subscribe(user => {
        if (user?.id) {
          this.stompClient.subscribe(`/user/${user.id}/queue/payments`, (message: { body: string }) => {
            const notification: PaymentNotification = JSON.parse(message.body);
            this.notificationSubject.next(notification);
            this.showBrowserNotification(notification);
          });
        }
      });
    });
  }

  private showBrowserNotification(notification: PaymentNotification) {
    if (this.isBrowser && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        this.displayNotification(notification);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.displayNotification(notification);
          }
        });
      }
    }
  }

  private displayNotification(notification: PaymentNotification) {
    new Notification('Paiement confirmé', {
      body: `Vous avez payé ${notification.amount}€ pour "${notification.artworkTitle}"`,
      icon: 'assets/icons/notification.png'
    });
  }
  

  public requestNotificationPermission() {
    if (this.isBrowser && 'Notification' in window) {
      Notification.requestPermission();
    }
  }

  public disconnect() {
    if (this.isBrowser && this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
