import { Component } from '@angular/core';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { TrainingService } from '../../../Services/training.service';
import { Training } from '../../../Models/training.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lists-training',
  standalone: true,

  imports: [NavbarComponent,FooterComponent,CommonModule],
  templateUrl: './lists-training.component.html',
  styleUrl: './lists-training.component.scss'
})
export class ListsTrainingComponent {

  trainings: Training[] = [];
  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.trainingService.getTrainings().subscribe(
      (data) => {
        console.log("Trainings reçus :", data);  // 🔍 Vérifie les données reçues

        this.trainings = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des formations', error);
      }
    );
  }
  
  }
  


