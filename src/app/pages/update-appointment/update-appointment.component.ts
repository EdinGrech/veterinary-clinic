import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Appointment,
  AppointmentExtended,
} from '../../models/appointment.model';
import { ContentCache, ContentState } from '../../models/api.utils';
import { AppointmentService } from '../../services/appointment-service/appointment-service.service';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../components/dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-update-appointment',
  imports: [
    ToolbarComponent,
    AppointmentFormComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.scss',
})
export class UpdateAppointmentComponent {
  id: string | null;
  appointment: ContentCache<AppointmentExtended> = {
    state: ContentState.LOADING,
  };

  updateState: ContentState = ContentState.NOT_INITIALIZED;
  error?: string;

  ContentState = ContentState;

  readonly dialog = inject(MatDialog);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService,
    private readonly router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null)
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
    else
      this.appointment = {
        state: ContentState.ERROR,
        error: 'No id provided',
      };
  }

  updateAppointment(appointment: Appointment) {
    if (appointment.animalType)
      this.appointmentService
        .updateAppointment(appointment, this.id!)
        .subscribe({
          next: () => {
            this.updateState = ContentState.LOADED;
            this.dialog.open(SuccessDialogComponent, {
              data: { message: 'Appointment updated' },
            });
            setTimeout(() => {
              this.router.navigate(['home']);
            }, 700);
          },
          error: (error) => {
            this.updateState = ContentState.ERROR;
            this.error = error.message;
          },
        });
  }
}
