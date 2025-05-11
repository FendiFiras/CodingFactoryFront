import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../elements/navbar/navbar.component';

@Component({
  selector: 'app-predection',
  imports: [CommonModule,    FormsModule, // <-- ajouter ici
    HttpClientModule],
  templateUrl: './predection.component.html',
  styleUrl: './predection.component.scss'
})

export class PredectionComponent {
  constructor(private http: HttpClient, private router: Router) {}
  // injection du service
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
    { label: 'Beginner', value: 0 },
    { label: 'Intermediate', value: 1 },
    { label: 'Advanced', value: 2 },
    { label: 'Expert', value: 3 }
  ];
  
  fields = [
    
      { label: 'Data Science & Intelligence Artificielle', value: 0 },
      { label: 'Web & Mobile Developement', value: 1 },
      { label: 'CyberSecurity', value: 2 },
      { label: 'Cloud Computing & DevOps', value: 3 },
      { label: 'Big Data & Data Analysis', value: 4 },
      { label: 'General informatics', value: 5 },
      { label: 'Systems & Networks', value: 6 },
      { label: 'UX/UI Design', value: 7 },
      { label: 'Blockchain & Web3', value: 8 }
  
    
  ];

  prepareFormData() {
    return {
      Level: Number(this.formData.Level),
      University_GPA: Number(this.formData.University_GPA),
      Field_of_Study: Number(this.formData.Field_of_Study),
      Internships_Completed: Number(this.formData.Internships_Completed),
      Projects_Completed: Number(this.formData.Projects_Completed),
      Certifications: Number(this.formData.Certifications),
      Soft_Skills_Score: Number(this.formData.Soft_Skills_Score),
      Career_Satisfaction: Number(this.formData.Career_Satisfaction)
    };
  }
  
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
  
    this.http.post<any>('http://localhost:5000/predict', this.prepareFormData())
      .subscribe(res => {
        this.result = res.prediction;
      });
  }
  onRecommendClick() {
    if (!this.isFormValid()) {
      alert('Please fill out all fields correctly before continuing.');
      return;
    }
  
    this.http.post<any>('http://localhost:5000/cluster', this.formData)
      .subscribe(res => {
        const cluster = res.cluster;
        // Ouvre un nouvel onglet vers le composant clustring avec le cluster en paramètre
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/clustring'], { queryParams: { cluster } })
        );
        window.open(url, '_blank');
      });
  }
  
  
}
