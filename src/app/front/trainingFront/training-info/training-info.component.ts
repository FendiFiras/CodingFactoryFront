import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../../Services/training.service';
import { Training } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-training-info',
  imports: [NavbarComponent, FooterComponent, CommonModule,],
  standalone: true,
  templateUrl: './training-info.component.html',
  styleUrl: './training-info.component.scss'
})
export class TrainingInfoComponent implements OnInit {
  selectedTraining!: Training | null;
  trainingDuration: number = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingService: TrainingService,
    private cdr: ChangeDetectorRef  // 🛠️ Ajout de ChangeDetectorRef

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const trainingId = Number(params.get('id')); // Récupération de l'ID
      if (!isNaN(trainingId)) {
        this.getTrainingDetails(trainingId);
      } else {
        this.router.navigate(['/TrainingList']); // Redirection si ID invalide
      }
    });
  }

  getTrainingDetails(trainingId: number) {
    this.trainingService.getTrainingById(trainingId).subscribe(
      (training: Training) => {
        this.selectedTraining = training;
  
        if (this.selectedTraining.startDate && this.selectedTraining.endDate) {
          this.trainingDuration = this.getTrainingDuration(
            this.selectedTraining.startDate, 
            this.selectedTraining.endDate
          );
  
          console.log("✅ Durée Calculée:", this.trainingDuration, "days");
  
          this.cdr.detectChanges(); // 🔄 Force la mise à jour du HTML
        }
      },
      (error) => {
        console.error('❌ Erreur lors du chargement de la formation', error);
        this.router.navigate(['/TrainingList']);
      }
    );
  }
  
  
  getTrainingDuration(start: string | Date, end: string | Date): number {
    if (!start || !end) return 0;
  
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("❌ Dates invalides:", start, end);
      return 0;
    }
  
    const difference = endDate.getTime() - startDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24)); // Convertit en jours
  }
  
  
  
  
}
