// pdfservice.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceservice {

  constructor() {}

  // Fonction pour générer un rapport PDF
  generatePdfReport(data: any): void {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Behavior Report', 20, 20);

    doc.setFontSize(12);
    let yPosition = 30;
    
    // Ajouter les données dans le PDF
    for (const [key, value] of Object.entries(data)) {
      doc.text(`${key}: ${value}`, 20, yPosition);
      yPosition += 10;
    }

    // Sauvegarder le PDF
    doc.save(`${data.name}_Behavior_Report.pdf`);
  }
}
