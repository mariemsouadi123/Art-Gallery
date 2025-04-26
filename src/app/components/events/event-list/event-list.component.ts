import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  allEvents: any[] = [];
  registeredEvents: any[] = [];
  loading = true;
  activeTab: 'all' | 'registered' = 'all';
  currentUser: any;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    console.log('Loading events...');
    this.eventService.getEvents().subscribe({
      next: (events: any) => {
        console.log('Received events:', events);
        this.allEvents = events;
        
        if (this.currentUser) {
          console.log('Loading registrations for user:', this.currentUser.id);
          this.eventService.getUserRegistrations(this.currentUser.id).subscribe({
            next: (registrations: any) => {
              console.log('Received registrations:', registrations);
              // Store full registration objects, not just events
              this.registeredEvents = registrations;
              this.loading = false;
            },
            error: (err: any) => {
              console.error('Error loading registrations:', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  isUserRegistered(eventId: number): boolean {
    return this.registeredEvents.some((reg: any) => reg.event?.id === eventId);
  }

  setActiveTab(tab: 'all' | 'registered'): void {
    this.activeTab = tab;
  }

  isEventPaid(eventId: number): boolean {
    const registration = this.registeredEvents.find((reg: any) => reg.event?.id === eventId);
    return registration?.paymentStatus === 'PAID';
  }

  getEventFromRegistration(registration: any): any {
    return registration.event || registration;
  }
  
  navigateToDashboard(): void {
    this.router.navigate(['/user-home']);
  }
}