import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any = null;
  loading = true;
  currentUser: any;
  isRegistered = false;
  registrationError = '';

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
      next: (event: any) => {
        this.event = event;
        this.checkRegistration();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading event:', err);
        this.router.navigate(['/events']);
      }
    });
  }

  checkRegistration(): void {
    if (this.currentUser && this.event) {
      this.eventService.getRegistration(this.event.id, this.currentUser.id).subscribe({
        next: (registration: any) => {
          this.isRegistered = true;
        },
        error: () => {
          this.isRegistered = false;
        }
      });
    }
  }

  registerForEvent(): void {
    if (!this.currentUser || !this.event) return;
  
    this.loading = true;
    this.registrationError = '';
  
    this.eventService.registerForEvent(this.event.id, this.currentUser.id).subscribe({
      next: () => {
        this.isRegistered = true;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.registrationError = err.error?.error || 'Already Registered';
      }
    });
  }
}