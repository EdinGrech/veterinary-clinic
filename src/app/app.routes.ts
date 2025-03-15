import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ListAppointmentComponent } from './pages/list-appointment/list-appointment.component';
import { AppointmentDetailsComponent } from './pages/appointment-details/appointment-details.component';
import { AddAppointmentComponent } from './pages/add-appointment/add-appointment.component';
import { UpdateAppointmentComponent } from './pages/update-appointment/update-appointment.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { RoleGuard } from './guard/role-guard.guard';
import { Roles } from './models/auth.models';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: ListAppointmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'details/:id',
    component: AppointmentDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: AddAppointmentComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.ADMIN, Roles.RECEPTIONIST] },
  },
  {
    path: 'update/:id',
    component: UpdateAppointmentComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Roles.ADMIN, Roles.RECEPTIONIST, Roles.VET] },
  },
];
