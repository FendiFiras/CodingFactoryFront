import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz.model';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8081/pidev/Quizs'; // URL de base pour l'API

  constructor(private http: HttpClient) {}

  // Ajouter un quiz
  addQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/add_quiz`, quiz);
  }

  // Récupérer tous les quiz
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/GetAllquizs`);
  }

  // Récupérer un quiz par ID
  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/getQuiz/${id}`);
  }

  // Mettre à jour un quiz
  updateQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/update_Quiz`, quiz);
  }

  // Supprimer un quiz
  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // ✅ Récupérer les quiz d'une formation spécifique
  getQuizzesByTraining(trainingId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/training/${trainingId}`);
  }
  getUsersByQuizId(idQuiz: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/${idQuiz}`);
  }
}
