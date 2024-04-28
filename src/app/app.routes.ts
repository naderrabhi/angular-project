import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './auth.guard';
import { ResponsableComponent } from './pages/responsable/responsable.component';
import { TechnicienComponent } from './pages/technicien/technicien.component';
import { UsersComponent } from './components/users/users.component';
import { EmplacementsComponent } from './components/emplacements/emplacements.component';
import { EquipementsComponent } from './components/equipements/equipements.component';
import { OrdreDeTravailComponent } from './components/ordre-de-travail/ordre-de-travail.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'contact', component: ContactComponent, pathMatch: 'full' },
  {
    path: 'user',
    component: OrdreDeTravailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] },
  },
  {
    path: 'responsable',
    component: ResponsableComponent,
    canActivate: [AuthGuard],
    data: { roles: ['RESPONSABLE'] },
  },
  {
    path: 'technicien',
    component: TechnicienComponent,
    canActivate: [AuthGuard],
    data: { roles: ['TECHNICIEN'] },
  },
  {
    path: 'admin',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'emplacements',
    component: EmplacementsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'equipements',
    component: EquipementsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
];
