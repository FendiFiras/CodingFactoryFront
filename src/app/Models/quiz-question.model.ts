import { QuizAnswer } from "./quiz-answer.model";


export class QuizQuestion {
    idQuizQ?: number; // L'ID est optionnel pour un nouvel enregistrement
    questionText!: string; // Texte de la question
    maxGrade!: number; // Note maximale pour cette question
    quizAnswers: QuizAnswer[] = []; // ✅ Liste des réponses associées

}
