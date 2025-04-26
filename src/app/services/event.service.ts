import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  registrationDate: string;
  paymentStatus: string;
  ticketCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get(`${this.apiUrl}/events`);
  }

  getTicket(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${eventId}/ticket`);
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/upcoming`);
  }

  getEvent(id: number) {
    return this.http.get(`${this.apiUrl}/events/${id}`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  registerForEvent(eventId: number, userId: number) {
    return this.http.post(
      `${this.apiUrl}/events/${eventId}/register/${userId}`,
      {}, 
      { withCredentials: true }
    );
  }

  getUserRegistrations(userId: number) {
    return this.http.get(
      `${this.apiUrl}/events/user/${userId}/registrations`,
      { withCredentials: true }
    );
  }

  getRegistration(eventId: number, userId: number) {
    return this.http.get(`${this.apiUrl}/events/${eventId}/registration/${userId}`);
  }

  isEventPaid(eventId: number, userId: number): Observable<boolean> {
    return this.getRegistration(eventId, userId).pipe(
      map((registration: any) => registration.paymentStatus === 'PAID'),
      catchError(() => of(false))
    );
  }
}