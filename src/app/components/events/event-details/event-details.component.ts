import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService, User } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe]
})
export class EventDetailsComponent implements OnInit {
  event: any = null;
  loading = true;
  currentUser: User | null = null;
  isRegistered = false;
  registrationError = '';
  showRegistrationForm = false;
  registrationData = {
    attendees: 1,
    specialRequirements: ''
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    this.loadEvent();
  }

  loadEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.checkRegistration();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.router.navigate(['/events']);
      }
    });
  }

  checkRegistration(): void {
    if (this.currentUser && this.event) {
      this.eventService.getUserRegistrations(this.currentUser.id).subscribe({
        next: (registrations: any[]) => {
          this.isRegistered = registrations.some(r => r.event.id === this.event?.id);
        },
        error: (err) => {
          console.error('Error checking registration:', err);
        }
      });
    }
  }

  registerForEvent(): void {
    if (!this.currentUser || !this.event) return;

    this.registrationError = '';
    const registrationPayload = {
      eventId: this.event.id,
      userId: this.currentUser.id,
      attendees: this.registrationData.attendees,
      specialRequirements: this.registrationData.specialRequirements
    };

    this.eventService.registerForEvent(registrationPayload).subscribe({
      next: () => {
        this.isRegistered = true;
        this.showRegistrationForm = false;
        this.router.navigate(['/events', this.event.id, 'ticket'], {
          queryParams: { refresh: Date.now() }
        });
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.registrationError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  toggleRegistrationForm(): void {
    this.showRegistrationForm = !this.showRegistrationForm;
  }
}