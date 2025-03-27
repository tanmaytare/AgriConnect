import { Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { EquipmentRentalComponent } from './equipment-rental/equipment-rental.component';
import { LaborHiringComponent } from './labor-hiring/labor-hiring.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';
import { OrdersComponent } from './orders/orders.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { MyjobsComponent } from './myjobs/myjobs.component';
import { RentalDashboardComponent } from './rental-dashboard/rental-dashboard.component';
import { WeatherComponent } from './weather/weather.component';
import { MarketComponent } from './market/market.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'marketplace', component: MarketplaceComponent,canActivate: [authGuard] },
  { path: 'equipment-rental', component: EquipmentRentalComponent,canActivate: [authGuard] },
  { path: 'labor-hiring', component: LaborHiringComponent,canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify-otp', component: OtpVerificationComponent },
  { path: 'forgot-pass' , component:ForgotPasswordComponent},
  { path: 'reset-pass' , component:ResetPasswordComponent},
  { path: 'dashboard', component: DashboardComponent,canActivate:[authGuard] },
  { path: 'products', component: ProductsComponent,canActivate:[authGuard] },
  { path: 'cart', component: CartComponent,canActivate:[authGuard] },
  { path: 'checkout', component: CheckoutComponent,canActivate:[authGuard] },
  { path: 'success', component: SuccessComponent,canActivate:[authGuard] },
  { path: 'orders', component: OrdersComponent,canActivate:[authGuard] },
  { path: 'myjobs', component: MyjobsComponent,canActivate:[authGuard] },
  { path: 'applications', component: MyApplicationsComponent,canActivate:[authGuard] },
  { path: 'rental-dashboard', component: RentalDashboardComponent,canActivate:[authGuard] },
  { path: 'weather', component: WeatherComponent },
  { path: 'market', component: MarketComponent },

];

