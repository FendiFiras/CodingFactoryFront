import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../../../Services/training.service';
import { Training } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';

@Component({
  selector: 'app-lists-training',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './lists-training.component.html',
  styleUrl: './lists-training.component.scss'
})
export class ListsTrainingComponent implements OnInit {
  trainings: Training[] = [];
  userId: number = 1; //fixer user 1 pour faire le test 


  constructor(
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainingService.getTrainings().subscribe(
      (data) => {
        console.log("Trainings reçus :", data);
        this.trainings = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des formations', error);
      }
    );
  }

  goToTrainingDetails(trainingId: number): void {
    this.router.navigate(['/TrainingInfo', trainingId]); // Navigation vers la page de détails
  }
}
