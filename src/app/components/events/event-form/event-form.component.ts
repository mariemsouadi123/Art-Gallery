import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true, // Add this for standalone component
  imports: [CommonModule, ReactiveFormsModule, RouterModule] // Add these imports
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId?: number;

  // Make router public to access it in template
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    public router: Router // Changed from private to public
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
    // Temporary bypass - remove in production
    this.eventId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.eventId;
    
    if (this.isEditMode) {
      this.loadEventForEdit();
    }
}

  loadEventForEdit(): void {
    if (!this.eventId) return;
    
    this.eventService.getEvent(this.eventId).subscribe(event => {
      this.eventForm.patchValue({
        ...event,
        startDate: this.formatDateForInput(event.startDate),
        endDate: this.formatDateForInput(event.endDate)
      });
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;
    
    const eventData = this.eventForm.value;
    const operation = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, eventData)
      : this.eventService.createEvent(eventData);

    operation.subscribe({
      next: (event) => {
        this.router.navigate(['/events', event.id]);
      },
      error: (err) => {
        console.error('Error saving event:', err);
      }
    });
  }

  private formatDateForInput(dateString: string): string {
    return dateString.substring(0, 16); // "YYYY-MM-DDTHH:mm"
  }
}