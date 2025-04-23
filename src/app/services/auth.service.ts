import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

 export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Initialize with current user if exists
    const user = this.getCurrentUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // SSR-safe localStorage access
  private getLocalStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage;
    }
    return null;
  }

  register(user: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
    role?: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/register`, 
      user, 
      { withCredentials: true }
    );
  }

  login(credentials: {email: string, password: string}): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        const storage = this.getLocalStorage();
        if (storage) {
          storage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  getCurrentUser(): User | null {
    const storage = this.getLocalStorage();
    if (storage) {
      const user = storage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
  getUserImageUrl(userId: number): string {
    return `${this.apiUrl}/user/${userId}/image?t=${Date.now()}`;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/logout`, 
      {}, 
      { withCredentials: true }
    ).pipe(
      tap(() => {
        const storage = this.getLocalStorage();
        if (storage) {
          storage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }

  updateUserProfile(userId: number, formData: FormData): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/user/${userId}`, 
      formData,
      { withCredentials: true }
    ).pipe(
      tap(updatedUser => {
        // Ensure the image URL is complete
        if (updatedUser.imageUrl && !updatedUser.imageUrl.startsWith('http')) {
          updatedUser.imageUrl = `http://localhost:8080${updatedUser.imageUrl}`;
        }
        this.updateCurrentUser(updatedUser);
      })
    );
  }

  updateCurrentUser(updatedUser: User): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    this.currentUserSubject.next(updatedUser);
  }
}