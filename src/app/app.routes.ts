import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; // Manquant
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'user-home', component: UserHomeComponent },
    { path: '**', redirectTo: 'login' }
];
