import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-ticket',
  templateUrl: './event-ticket.component.html',
  styleUrls: ['./event-ticket.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe]
})
export class EventTicketComponent implements OnInit {
  loading = true;
  error = false;
  event: any;
  ticket: any;
  currentUser: any;
  ticketCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const eventId = this.route.snapshot.params['id'];
    this.loadEventAndRegistration(eventId);
  }

  loadEventAndRegistration(eventId: number): void {
    // First load the event
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.event = event;
        // Then load the registration/ticket info
        this.eventService.getRegistration(eventId, this.currentUser.id).subscribe({
          next: (registration: any) => {
            this.ticket = {
              ticketCode: registration.ticketCode,
              paymentStatus: registration.paymentStatus,
              registrationDate: registration.registrationDate
            };
            this.ticketCode = registration.ticketCode || this.generateTicketCode();
            this.loading = false;
          },
          error: () => {
            this.error = true;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  generateTicketCode(): string {
    return 'ARTY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  printTicket(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}