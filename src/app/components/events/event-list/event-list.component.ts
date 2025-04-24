import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.eventService.getEvents().subscribe({
      next: (events: any) => {
        this.allEvents = events;
        
        if (this.currentUser) {
          this.eventService.getUserRegistrations(this.currentUser.id).subscribe({
            next: (registrations: any) => {
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
    if (!this.currentUser) return;
    
    this.eventService.registerForEvent({
      eventId: eventId,
      userId: this.currentUser.id,
      attendees: 1
    }).subscribe({
      next: () => {
        this.loadData(); // Refresh the list
      },
      error: (err) => {
        console.error('Registration failed:', err);
      }
    });
  }

  setActiveTab(tab: 'all' | 'registered'): void {
    this.activeTab = tab;
  }
}