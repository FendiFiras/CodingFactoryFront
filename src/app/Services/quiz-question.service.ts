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

  // ✅ Récupérer toutes les questions
  getAllQuestions(): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(`${this.apiUrl}/GetAllquestion`);
  }

  getAnswersByQuestionId(questionId: number): Observable<QuizAnswer[]> {
    return this.http.get<QuizAnswer[]>(`${this.apiUrl}/questions/${questionId}/answers`);
  }
  addAnswerToQuestion(questionId: number, newAnswer: QuizAnswer): Observable<QuizAnswer> {
    return this.http.post<QuizAnswer>(`${this.apiUrl}/questions/${questionId}/answers`, newAnswer);
  }
  submitQuizResponses(userId: number, quizId: number, selectedAnswers: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit/${userId}/${quizId}`, selectedAnswers);
  }
  calculateQuizScore(quizId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/calculate-score/${quizId}/${userId}`);
  }

  submitAndCalculateScore(userId: number, quizId: number, selectedAnswers: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-and-score/${userId}/${quizId}`, selectedAnswers);
}
generateQuestions(quizId: number, topic: string, numberOfQuestions: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/generate-questions/${quizId}?topic=${topic}&numberOfQuestions=${numberOfQuestions}`, {});
}

sendCheatingReport(quizId: number, file: Blob): Observable<any> {
  const formData = new FormData();
  formData.append('quizId', quizId.toString());
  formData.append('file', file, 'cheating_report.pdf');

  return this.http.post('http://localhost:8089/pidev/Quizs/api/cheating/report', formData);
}



}
