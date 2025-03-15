import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment-service/appointment-service.service';
import { ContentCache, ContentState } from '../../models/api.utils';
import { AppointmentExtended } from '../../models/appointment.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Roles } from '../../models/auth.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-appointment-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    ToolbarComponent,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss',
})
export class AppointmentDetailsComponent implements OnInit {
  id?: string | null;
  appointment: ContentCache<AppointmentExtended> = {
    state: ContentState.LOADING,
  };
  role: Roles | null;
  Roles = Roles;

  ContentState = ContentState;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService
  ) {
    const storedRole = localStorage.getItem('role');
    this.role =
      storedRole && Object.values(Roles).includes(storedRole as Roles)
        ? (storedRole as Roles)
        : null;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.appointmentService.getAppointmentById(this.id).subscribe({
        next: (appointment) => {
          this.appointment = {
            state: ContentState.LOADED,
            data: appointment,
          };
        },
        error: (error) => {
          this.appointment = {
            state: ContentState.ERROR,
            error: error,
          };
        },
      });
    } else
      this.appointment = {
        state: ContentState.ERROR,
        error: 'No id provided',
      };
  }
}
