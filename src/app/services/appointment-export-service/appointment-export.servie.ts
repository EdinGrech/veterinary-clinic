import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppointmentExtended } from '../../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentExportService {
  constructor() {}

  /**
   * Exports appointments to Excel file
   * @param appointments List of appointments to export
   * @param fileName Name of the exported file (without extension)
   */
  exportToExcel(
    appointments: AppointmentExtended[],
    fileName: string = 'appointments'
  ): void {
    const workbook = XLSX.utils.book_new();

    const formattedData = appointments.map((appointment) => ({
      'Appointment ID': appointment.appointmentId,
      'Animal Type': appointment.animalType,
      Date: appointment.appointmentDate,
      Time: appointment.appointmentTime,
      'Duration (min)': appointment.appointmentDuration,
      'Patient Name': appointment.patientName,
      'Owner Name': `${appointment.ownerName} ${appointment.ownerSurname}`,
      'Owner ID': appointment.ownerIdCardNumber,
      'Contact Number': appointment.ownerContactNumber,
      Reason: appointment.reasonForAppointment,
      'Vet Notes': appointment.vetNotes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  /**
   * Exports appointments to PDF file
   * @param appointments List of appointments to export
   * @param fileName Name of the exported file (without extension)
   */
  exportToPdf(
    appointments: AppointmentExtended[],
    fileName: string = 'appointments'
  ): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Appointments List', 14, 22);
    doc.setFontSize(10);

    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 30);

    const columns = [
      'ID',
      'Animal',
      'Date',
      'Time',
      'Duration',
      'Patient',
      'Owner',
      'Contact',
      'Reason',
      'Notes',
    ];

    const data = appointments.map((appointment) => [
      appointment.appointmentId,
      appointment.animalType,
      appointment.appointmentDate,
      appointment.appointmentTime,
      `${appointment.appointmentDuration} min`,
      appointment.patientName,
      `${appointment.ownerName} ${appointment.ownerSurname}`,
      appointment.ownerContactNumber,
      appointment.reasonForAppointment,
      appointment.vetNotes || '',
    ]);

    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 15 },
        8: { cellWidth: 30 },
        9: { cellWidth: 30 },
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save(`${fileName}.pdf`);
  }
}
