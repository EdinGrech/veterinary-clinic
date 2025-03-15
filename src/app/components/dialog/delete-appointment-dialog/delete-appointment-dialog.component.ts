import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
} from '@angular/material/dialog';
import { AppointmentService } from '../../../services/appointment-service/appointment-service.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-appointment-dialog',
  imports: [MatDialogActions, MatButtonModule],
  templateUrl: './delete-appointment-dialog.component.html',
  styleUrl: './delete-appointment-dialog.component.scss',
})
export class DeleteAppointmentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAppointmentDialogComponent>);
  readonly data = inject<{ id: string }>(MAT_DIALOG_DATA);
  private readonly appointmentService = inject(AppointmentService);
  isLoading = false;
  error?: string;

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.isLoading = true;
    this.appointmentService.deleteAppointment(this.data.id).subscribe({
      next: () => {
        this.isLoading = false;
        setTimeout(() => {
          this.dialogRef.close();
        }, 700);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message;
      },
    });
  }
}
