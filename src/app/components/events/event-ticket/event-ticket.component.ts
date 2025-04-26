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
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.loadTicket(eventId);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadTicket(eventId: string) {
    // Change getUserTicket to getTicket if that's the correct method name
    this.eventService.getTicket(eventId).subscribe({
      next: (ticket: any) => {  // Add type annotation
        this.ticket = ticket;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  printTicket() {
    window.print();
  }
}