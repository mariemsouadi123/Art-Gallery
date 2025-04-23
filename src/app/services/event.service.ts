import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // In event.service.ts
  getUpcomingEvents(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/upcoming?testData=true`); // Temporary for testing
  }

  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  registerForEvent(eventId: number, userId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${eventId}/register/${userId}`, 
      {},
      { observe: 'response' } // Get full response
    );
  }

  getUserRegistrations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}