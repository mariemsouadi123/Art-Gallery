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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe(response => {
      if (response.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        // ✅ Stocker full_name, email et rôle
        localStorage.setItem('user', JSON.stringify({
          full_name: response.full_name, 
          email: response.email, 
          role: response.role 
        }));

        this.router.navigate(['/user-home']);
      }
    }, (error: any) => {
      console.error('Login failed', error);
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
