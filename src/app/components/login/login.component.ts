import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.user).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          // Force reload to ensure all data is fresh
          window.location.href = '/user-home';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password';
        console.error('Login error:', error);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}