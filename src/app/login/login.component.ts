import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Import FormsModule & ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { error } from 'console';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Standalone component
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
        this.router.navigate(['/user-home']);
      }
    }, error => {
      console.error('Login failed', error);
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
