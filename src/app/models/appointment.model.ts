export interface Appointment {
  animalType: string;
  appointmentDate: string;
  appointmentDuration: number;
  appointmentTime: string;
  ownerContactNumber: string;
  ownerIdCardNumber: string;
  ownerName: string;
  ownerSurname: string;
  patientName: string;
  reasonForAppointment: string;
  vetNotes: string | undefined | null;
}

export interface AppointmentExtended extends Appointment {
  appointmentId: string;
}
