import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../services/appointment-service/appointment-service.service';
import { AppointmentExtended } from '../../models/appointment.model';
import { ContentCache, ContentState } from '../../models/api.utils';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Roles } from '../../models/auth.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAppointmentDialogComponent } from '../../components/dialog/delete-appointment-dialog/delete-appointment-dialog.component';
import { AppointmentStatusPipe } from '../../pipes/appointment-status.pipe';
import { AppointmentExportService } from '../../services/appointment-export-service/appointment-export.servie';

@Component({
  selector: 'app-list-appointment',
  imports: [
    MatTableModule,
    MatButtonModule,
    ToolbarComponent,
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
    AppointmentStatusPipe,
  ],
  templateUrl: './list-appointment.component.html',
  styleUrl: './list-appointment.component.scss',
})
export class ListAppointmentComponent {
  displayedColumns: string[] = [
    'id',
    'patientName',
    'animalType',
    'ownerName',
    'ownerSurname',
    'appointmentDateTime',
    'appointmentDuration',
    'appointmentStatus',
    'actions',
  ];

  ContentState = ContentState;

  appointment: ContentCache<MatTableDataSource<AppointmentExtended>> = {
    state: ContentState.LOADING,
  };
  role: Roles | null;
  Roles = Roles;

  readonly dialog = inject(MatDialog);
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentExportService: AppointmentExportService
  ) {
    const storedRole = localStorage.getItem('role');
    this.role =
      storedRole && Object.values(Roles).includes(storedRole as Roles)
        ? (storedRole as Roles)
        : null;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointment = {
          state: ContentState.LOADED,
          data: new MatTableDataSource<AppointmentExtended>(data),
        };
      },
      error: (error) => {
        this.appointment = {
          state: ContentState.ERROR,
          error: error.message,
        };
      },
    });
  }

  deleteAppointment(id: string) {
    this.dialog.open(DeleteAppointmentDialogComponent, { data: { id } });
  }

  exportPfd() {
    if (this.appointment.data)
      this.appointmentExportService.exportToPdf(this.appointment.data.data);
  }

  exportExcel() {
    if (this.appointment.data)
      this.appointmentExportService.exportToExcel(this.appointment.data.data);
  }
}
