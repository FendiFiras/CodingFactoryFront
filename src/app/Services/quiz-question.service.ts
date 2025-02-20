import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizQuestion } from '../Models/quiz-question.model';
import { QuizAnswer } from '../Models/quiz-answer.model';

@Injectable({
  providedIn: 'root'
})
export class QuizQuestionService {
  private apiUrl = 'http://localhost:8089/pidev/Quizs'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les questions d'un quiz
  getQuestionsByQuiz(quizId: number): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(`${this.apiUrl}/quiz/${quizId}/questions`);
  }

  // Ajouter une question avec ses réponses
  addQuestionWithAnswers(quizId: number, question: QuizQuestion, answers: QuizAnswer[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/quiz/${quizId}/addQuestion`, { ...question, quizAnswers: answers });
  }

  // Mettre à jour une question
  updateQuestion(question: QuizQuestion): Observable<QuizQuestion> {
    return this.http.put<QuizQuestion>(`${this.apiUrl}/update_question`, question);
  }

  // Supprimer une question
  deleteQuestion(idQuizQ: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteQuestion/${idQuizQ}`);
  }

  // Mettre à jour une réponse spécifique
  updateAnswer(answer: QuizAnswer): Observable<QuizAnswer> {
    return this.http.put<QuizAnswer>(`${this.apiUrl}/answers_update`, answer);
  }
}
