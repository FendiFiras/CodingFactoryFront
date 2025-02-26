import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../Models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = 'http://localhost:8089/pidev/trainings';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les formations
  getTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/Get_alltrainings`);
  }

  // ✅ Récupérer une formation par ID
  getTrainingById(trainingId: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/List_training/${trainingId}`);
  }

  // ✅ Ajouter une formation (avec userId)
  addTraining(training: Training, userId: number): Observable<Training> {
    return this.http.post<Training>(`${this.apiUrl}/addtraining/${userId}`, training);
  }

  // ✅ Mettre à jour une formation
  updateTraining(training: Training): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/updatetraining`, training);
  }

  // ✅ Supprimer une formation
  deleteTraining(trainingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${trainingId}`);
  }

  // ✅ Assigner un quiz
  assignQuiz(trainingId: number, quizId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/assign-quiz/${trainingId}/${quizId}`, null);
  }
  // ✅ Récupérer les formations de l'utilisateur avec l'ID 1 (fixé)
  getUserTrainings(userId: number): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/user/${userId}`);
  }
  
// ✅ Fonction pour affecter un quiz à une formation
assignQuizToTraining(trainingId: number, quizId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/assign-quiz/${trainingId}/${quizId}`, {});
}
getTrainingsByQuiz(quizId: number): Observable<Training[]> {
  return this.http.get<Training[]>(`${this.apiUrl}/quiz/${quizId}`);
}

getTrainingsForCourse(courseId: number): Observable<Training[]> {
  return this.http.get<Training[]>(`${this.apiUrl}/courses/${courseId}`);
}


}