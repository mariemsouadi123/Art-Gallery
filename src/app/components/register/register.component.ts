import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
isLoading() {
throw new Error('Method not implemented.');
}
  registerForm: FormGroup;
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Please fill all fields correctly');
      return;
    }

    const formData = this.registerForm.value;
    this.authService.register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      role: formData.role
    }).subscribe({
      next: (response) => {
        this.successMessage.set(response.message || 'Registration successful!');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage.set(
          error.error?.message || 
          error.error?.error || 
          'Registration failed. Please try again.'
        );
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}