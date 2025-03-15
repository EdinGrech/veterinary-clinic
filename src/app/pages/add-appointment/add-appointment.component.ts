import { Component } from '@angular/core';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';
import { AppointmentService } from '../../services/appointment-service/appointment-service.service';
import { Appointment } from '../../models/appointment.model';
import { ContentState } from '../../models/api.utils';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-add-appointment',
  imports: [AppointmentFormComponent, ToolbarComponent],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  state: ContentState = ContentState.NOT_INITIALIZED;
  error?: string;

  constructor(private readonly appointmentService: AppointmentService) {}

  submit(appointment: Appointment) {
    this.state = ContentState.LOADING;
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
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
