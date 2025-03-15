import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentState } from '../../models/api.utils';
import { RouterModule } from '@angular/router';

export type AppointmentForm = {
  [K in keyof Appointment]: FormControl<Appointment[K]>;
};

function futureAppointmentValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const dateControl = formGroup.get('appointmentDate');
    const timeControl = formGroup.get('appointmentTime');
    const date = dateControl?.value;
    const time = timeControl?.value;

    if (!date || !time) {
      return null;
    }

    const appointmentDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const isPastAppointment = appointmentDateTime < new Date();

    if (isPastAppointment) {
      dateControl?.setErrors({ ...dateControl.errors, pastAppointment: true });
      timeControl?.setErrors({ ...timeControl.errors, pastAppointment: true });
      return { pastAppointment: true };
    } else {
      if (dateControl?.errors?.['pastAppointment']) {
        const { pastAppointment, ...restErrors } = dateControl.errors;
        dateControl.setErrors(
          Object.keys(restErrors).length ? restErrors : null
        );
      }
      if (timeControl?.errors?.['pastAppointment']) {
        const { pastAppointment, ...restErrors } = timeControl.errors;
        timeControl.setErrors(
          Object.keys(restErrors).length ? restErrors : null
        );
      }
      return null;
    }
  };
}

function convertISOToCustomFormat(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function convertCustomFormatToISO(customDate: string): string {
  const [day, month, year] = customDate.split('/');
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  return date.toISOString();
}

@Component({
  selector: 'app-appointment-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup<AppointmentForm> = new FormGroup<AppointmentForm>(
    {
      patientName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      animalType: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      ownerName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      ownerSurname: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      appointmentDuration: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      appointmentDate: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      appointmentTime: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      ownerContactNumber: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      ownerIdCardNumber: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\d+[A-Za-z]$/)],
      }),
      reasonForAppointment: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      vetNotes: new FormControl(undefined),
    },
    { validators: futureAppointmentValidator() }
  );

  formPreFillData = input<Appointment>();
  state = input.required<ContentState>();
  error = input<string>();
  submit = output<Appointment>();

  readonly ContentState = ContentState;

  ngOnInit(): void {
    if (this.formPreFillData())
      this.appointmentForm.patchValue({
        ...this.formPreFillData()!,
        appointmentDate: convertCustomFormatToISO(
          this.formPreFillData()!.appointmentDate!
        ),
      });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.submit.emit({
        ...this.appointmentForm.value,
        appointmentDate: convertISOToCustomFormat(
          this.appointmentForm.value.appointmentDate!
        ),
      } as Appointment);
    }
  }
}
