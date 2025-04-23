import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, CurrencyPipe, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  allEvents: any[] = [];          // All events from event table
  registeredEvents: any[] = [];   // Events user (id=2) has registered for
  loading = true;
  activeTab: 'all' | 'registered' = 'all';
  userId = 2; // Hardcoded since no authentication

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load all events - using getEvents() instead of getAllEvents()
    this.eventService.getEvents().subscribe({
      next: (events: any) => {
        this.allEvents = events;
        
        // Load registered events for user_id=2
        this.eventService.getUserRegistrations(this.userId).subscribe({
          next: (registrations: any) => {
            // Extract event details from registrations
            this.registeredEvents = registrations.map((reg: any) => reg.event);
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error loading registrations:', err);
            this.loading = false;
          }
        });
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
    this.eventService.registerForEvent(eventId, this.userId).subscribe({
      next: () => {
        // Refresh registered events after successful registration
        this.eventService.getUserRegistrations(this.userId).subscribe((registrations: any) => {
          this.registeredEvents = registrations.map((reg: any) => reg.event);
        });
      },
      error: (err: any) => {
        console.error('Registration failed:', err);
      }
    });
  }

  setActiveTab(tab: 'all' | 'registered'): void {
    this.activeTab = tab;
  }
}