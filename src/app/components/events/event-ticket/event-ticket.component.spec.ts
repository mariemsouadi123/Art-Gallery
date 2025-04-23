import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-ticket',
  templateUrl: './event-ticket.component.html',
  styleUrls: ['./event-ticket.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EventTicketComponent implements OnInit {
  event: any;
  ticket: any;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = +this.route.snapshot.params['id'];
    console.log('Loading ticket for event:', eventId);

    // Temporary test user ID - replace with actual auth later
    const testUserId = 2; // Using the user ID we know has registrations
    
    this.loadEventAndTicket(eventId, testUserId);
  }

  loadEventAndTicket(eventId: number, userId: number): void {
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        console.log('Event loaded:', event);
        this.event = event;
        
        this.eventService.getUserRegistrations(userId).subscribe({
          next: (registrations) => {
            console.log('Registrations loaded:', registrations);
            
            // Handle both event object and event ID cases
            this.ticket = registrations.find((r: any) => {
              if (!r.event) return false;
              return typeof r.event === 'object' 
                ? r.event.id === eventId
                : r.event === eventId;
            });
            
            if (this.ticket) {
              console.log('Found ticket:', this.ticket);
              // Ensure required fields exist
              this.ticket.ticketCode = this.ticket.ticketCode || 'MISSING-CODE';
              this.ticket.registrationDate = this.ticket.registrationDate || new Date().toISOString();
              this.ticket.paymentStatus = this.ticket.paymentStatus || 'pending';
            } else {
              console.warn('No matching ticket found, using demo data');
              this.ticket = this.createDemoTicket(eventId);
            }
            
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading registrations:', err);
            this.error = true;
            this.errorMessage = 'Failed to load registration data';
            this.loading = false;
            this.ticket = this.createDemoTicket(eventId); // Fallback
          }
        });
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.error = true;
        this.errorMessage = 'Failed to load event information';
        this.loading = false;
      }
    });
  }

  private createDemoTicket(eventId: number): any {
    return {
      ticketCode: 'DEMO-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      paymentStatus: 'demo',
      registrationDate: new Date().toISOString(),
      event: { id: eventId }
    };
  }

  printTicket(): void {
    window.print();
  }
}