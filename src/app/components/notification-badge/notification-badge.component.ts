import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

interface PaymentNotification {
  paymentId: number;
  message: string;
  amount: number;
  date: string;
  artworkTitle: string;
}

@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="notification" class="notification-badge" (click)="dismiss()">
    <div class="notification-icon">💳</div>
    <div class="notification-content">
      <div class="notification-message">{{ notification.message }}</div>
      <div class="notification-details">
        <span class="artwork">{{ notification.artworkTitle }}</span>
        <span class="amount">{{ notification.amount | currency:'EUR' }}</span>
      </div>
    </div>
  </div>
`
,
  styleUrls: ['./notification-badge.component.css']
})
export class NotificationBadgeComponent implements OnInit, OnDestroy {
  notification: PaymentNotification | null = null;
  private timeoutId: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      if (notification) {
        this.clearTimeout();
        this.timeoutId = setTimeout(() => this.dismiss(), 10000);
      }
    });
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  dismiss() {
    this.clearTimeout();
    this.notification = null;
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}