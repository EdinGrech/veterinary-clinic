import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import {
  Appointment,
  AppointmentExtended,
} from '../../models/appointment.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private readonly http: HttpClient) {}

  getAppointments(): Observable<AppointmentExtended[]> {
    return this.http.get<AppointmentExtended[]>(
      `${environment.api}/appointment`
    );
  }

  getAppointmentById(id: string): Observable<AppointmentExtended> {
    return this.http.get<AppointmentExtended>(
      `${environment.api}/appointment/${id}`
    );
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${environment.api}/appointment`,
      appointment
    );
  }

  updateAppointment(
    appointment: Appointment,
    id: string
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${environment.api}/appointment/${id}`,
      appointment
    );
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.api}/appointment/${id}`);
  }
}
