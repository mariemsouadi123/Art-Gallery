import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user-home', component: UserHomeComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'marketplace', component: MarketplaceComponent},
    { path: 'checkout', component: CheckoutComponent}
];