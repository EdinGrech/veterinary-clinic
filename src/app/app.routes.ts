import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard.guard';
import { RoleGuard } from './guard/role-guard.guard';
import { Roles } from './models/auth.models';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/list-appointment/list-appointment.component').then(
        (m) => m.ListAppointmentComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/appointment-details/appointment-details.component').then(
        (m) => m.AppointmentDetailsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/add-appointment/add-appointment.component').then(
        (m) => m.AddAppointmentComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.ADMIN, Roles.RECEPTIONIST] },
  },
  {
    path: 'update/:id',
    loadComponent: () =>
      import('./pages/update-appointment/update-appointment.component').then(
        (m) => m.UpdateAppointmentComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.ADMIN, Roles.RECEPTIONIST, Roles.VET] },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
