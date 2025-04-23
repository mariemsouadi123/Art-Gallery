import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EventDetailsComponent implements OnInit {
  event: any;
  loading = true;
  currentUserId: number | null = null;
  isRegistered = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  /** ✅ Fix TypeScript error by ensuring we properly call getUser() */
  getCurrentUser(): void {
    this.authService.getUser().subscribe({
      next: (user: { id: number; username: string; email: string }) => {
        this.currentUserId = user.id;
        this.loadEvent();
      },
      error: () => {
        this.currentUserId = null;
        this.router.navigate(['/login']); // Redirect if not logged in
      }
    });
  }

  loadEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.checkRegistration();
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/events']);
      }
    });
  }

  checkRegistration(): void {
    if (this.currentUserId && this.event) {
      this.eventService.getUserRegistrations(this.currentUserId).subscribe({
        next: (registrations: any[]) => {
          this.isRegistered = registrations.some((r: any) => r.event.id === this.event?.id);
        }
      });
    }
  }

  registerForEvent(): void {
    if (this.currentUserId && this.event) {
      this.eventService.registerForEvent(this.event.id, this.currentUserId)
        .subscribe({
          next: () => {
            this.isRegistered = true;
            this.router.navigate(['/events', this.event.id, 'ticket'], {
              queryParams: { refresh: new Date().getTime() }
            });
          },
          error: (err) => {
            console.error('Registration error:', err);
          }
        });
    }
  }
}
