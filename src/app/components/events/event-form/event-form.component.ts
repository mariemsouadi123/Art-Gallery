import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId?: number;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: [''],
      onlineUrl: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      capacity: [null],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.eventId;
    
    if (this.isEditMode) {
      this.loadEventForEdit();
    }
  }

  loadEventForEdit(): void {
    if (!this.eventId) return;
    
    this.loading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (event: any) => {
        if (event) {
          this.eventForm.patchValue({
            title: event.title,
            description: event.description,
            startDate: this.formatDateForInput(event.startDate),
            endDate: this.formatDateForInput(event.endDate),
            location: event.location || '',
            onlineUrl: event.onlineUrl || '',
            price: event.price || 0,
            capacity: event.capacity || null,
            imageUrl: event.imageUrl || ''
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.errorMessage = 'Failed to load event data';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;
    
    this.loading = true;
    const eventData = this.eventForm.value;
    
    const operation = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, eventData)
      : this.eventService.createEvent(eventData);

    operation.subscribe({
      next: () => {  // Remove the event parameter since we don't need it
        this.router.navigate(['/admin-dashboard/events']);  // Navigate to events list
      },
      error: (err) => {
        console.error('Error saving event:', err);
        this.errorMessage = err.error?.message || 'Failed to save event';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/events']);  // Navigate to events list
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    return dateString.substring(0, 16);
  }
}