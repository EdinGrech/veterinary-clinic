import { Component, inject } from '@angular/core';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { AppointmentService } from '../../services/appointment-service/appointment-service.service';
import { Appointment } from '../../models/appointment.model';
import { ContentState } from '../../models/api.utils';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../components/dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-appointment',
  imports: [AppointmentFormComponent, ToolbarComponent],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  state: ContentState = ContentState.NOT_INITIALIZED;
  error?: string;

  readonly dialog = inject(MatDialog);

  constructor(private readonly appointmentService: AppointmentService) {}

  submit(appointment: Appointment) {
    this.state = ContentState.LOADING;
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
        this.dialog.open(SuccessDialogComponent, {
          data: { message: 'Appointment added' },
        });
        this.state = ContentState.LOADED;
        this.error = undefined;
      },
      error: (error) => {
        this.state = ContentState.ERROR;
        this.error = error.message;
      },
    });
  }
}
