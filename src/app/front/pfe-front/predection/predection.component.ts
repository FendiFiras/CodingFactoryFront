import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-predection',
  imports: [CommonModule,    FormsModule, // <-- ajouter ici
    HttpClientModule],
  templateUrl: './predection.component.html',
  styleUrl: './predection.component.scss'
})

export class PredectionComponent {
  constructor(private http: HttpClient
  ) {}  // injection du service
  result: number | null = null;  // <-- ajouter cette ligne
  @Output() close = new EventEmitter<void>();

  formData = {
    Level: 0,
    University_GPA: 0,
    Field_of_Study: 0,
    Internships_Completed: 0,
    Projects_Completed: 0,
    Certifications: 0,
    Soft_Skills_Score: 0,
    Career_Satisfaction: 0
  };
  
  levels = [
    { label: 'Débutant', value: 0 },
    { label: 'Intermédiaire', value: 1 },
    { label: 'Avancé', value: 2 },
    { label: 'Expert', value: 3 }
  ];
  
  fields = [
    { label: 'Sciences', value: 0 },
    { label: 'Droit', value: 1 },
    { label: 'Médecine', value: 2 },
    { label: 'Informatique', value: 3 },
    { label: 'Commerce', value: 4 },
    { label: 'Ingénierie', value: 5 },
    { label: 'Lettres', value: 6 },
    { label: 'Art', value: 7 },
    { label: 'Autre', value: 8 }
  ];
  isFormValid(): boolean {
    const f = this.formData;
  
    return (
      f.University_GPA >= 0 && f.University_GPA <= 20 &&
      f.Level >= 0 && f.Level <= 3 &&
      f.Field_of_Study >= 0 && f.Field_of_Study <= 8 &&
      f.Internships_Completed >= 0 &&
      f.Projects_Completed >= 0 &&
      f.Certifications >= 0 &&
      f.Soft_Skills_Score >= 0 && f.Soft_Skills_Score <= 10 &&
      f.Career_Satisfaction >= 0 && f.Career_Satisfaction <= 10
    );
  }
  
  submitForm() {
    if (!this.isFormValid()) {
      alert('Please fill out all fields correctly before submitting.');
      return;
    }
  
    this.http.post<any>('http://localhost:5000/predict', this.formData)
      .subscribe(res => {
        this.result = res.prediction;
      });
  }
  
  
}
