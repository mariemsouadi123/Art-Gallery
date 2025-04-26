import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
    console.log('Loading events...'); // Removed apiUrl reference
    this.eventService.getEvents().subscribe({
      next: (events: any) => {
        console.log('Received events:', events);
        this.allEvents = events;
        
        if (this.currentUser) {
          console.log('Loading registrations for user:', this.currentUser.id);
          this.eventService.getUserRegistrations(this.currentUser.id).subscribe({
            next: (registrations: any) => {
              console.log('Received registrations:', registrations);
              this.registeredEvents = registrations.map((reg: any) => reg.event);
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
    return this.registeredEvents.some((event: any) => event.id === eventId);
  }

  registerForEvent(eventId: number): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.eventService.registerForEvent(eventId, this.currentUser.id).subscribe({
      next: (registration: any) => {
        this.router.navigate(['/events', eventId, 'checkout'], {
          state: { 
            registrationId: registration.id,
            event: registration.event
          }
        });
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        alert(`Registration failed: ${err.error?.message || err.statusText}`);
      }
    });
  }

  setActiveTab(tab: 'all' | 'registered'): void {
    this.activeTab = tab;
  }
}