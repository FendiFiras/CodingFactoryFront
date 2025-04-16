import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from 'src/app/models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = 'http://localhost:8081/pidev/trainings';

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
isUserEnrolled(userId: number, trainingId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/is-enrolled/${userId}/${trainingId}`);
}


 // ✅ Récupérer les dernières formations ajoutées
 getLatestTrainings(): Observable<Training[]> {
  return this.http.get<Training[]>(`${this.apiUrl}/latest-trainings`);
}

// ✅ Récupérer les formations auxquelles l'utilisateur n'est PAS inscrit
getTrainingsNotEnrolled(userId: number): Observable<Training[]> {
  return this.http.get<Training[]>(`${this.apiUrl}/not-enrolled/${userId}`);
}
// ✅ Vérifier si l'utilisateur est éligible à un discount et récupérer le code promo
isUserEligibleForDiscount(userId: number): Observable<string | null> {
  return this.http.get<string>(`${this.apiUrl}/is-eligible-for-discount/${userId}`);
}

// ✅ Vérifier si le code promo entré par l'utilisateur est valide
validatePromoCode(userId: number, enteredCode: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/validate-promo/${userId}/${enteredCode}`);
}
getTrainingRevenue(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/revenue`);
}


getRevenueByHour(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/revenue-by-hour`);
}


/** 📊 Récupérer la prédiction des revenus par heure */
getPredictedHourlyRevenue(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/predicted-hourly-revenue`);
}

}