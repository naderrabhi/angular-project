import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TechnicianByUserRoleComponent } from './pages/technician-by-user-role/technician-by-user-role.component';
import { PeripheralByUserRoleComponent } from './pages/peripheral-by-user-role/peripheral-by-user-role.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AuthGuard } from './auth.guard';
import { ResTechnicianByUserRoleComponent } from './pages/res-technician-by-user-role/res-technician-by-user-role.component';

export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'peripheral',
    component: PeripheralByUserRoleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] },
  },
  {
    path: 'responsable',
    component: ResTechnicianByUserRoleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['RESPONSABLE'] },
  },
  {
    path: 'technicians',
    component: TechnicianByUserRoleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['TECHNICIAN'] },
  },
  {
    path: 'dashboard',
    component: AllUsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'all-users',
    component: AllUsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
];
