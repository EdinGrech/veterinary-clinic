import { Pipe, PipeTransform } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Pipe({
  name: 'appointmentStatus',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(appointment: Appointment): 'past' | 'future' {
    const [day, month, year] = appointment.appointmentDate
      .split('/')
      .map(Number);
    const appointmentDateTime = new Date(
      year,
      month - 1,
      day,
      ...appointment.appointmentTime.split(':').map(Number)
    );

    return appointmentDateTime < new Date() ? 'past' : 'future';
  }
}
