import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../Services/quiz.service';
import { QuizQuestionService } from '../../../Services/quiz-question.service';
import { Quiz } from '../../../Models/quiz.model';
import { QuizQuestion } from '../../../Models/quiz-question.model';
import { QuizAnswer } from '../../../Models/quiz-answer.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../elements/navbar/navbar.component';
import { FooterComponent } from '../../elements/footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-questions-management',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './quiz-questions-management.component.html',
  styleUrls: ['./quiz-questions-management.component.scss']
})
export class QuizQuestionsManagementComponent implements OnInit {
  
  quizzes: Quiz[] = [];
  questionForm: FormGroup;

  constructor(
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      quizId: ['', Validators.required],
      questionText: ['', Validators.required],
      maxGrade: ['', [Validators.required, Validators.min(1)]],
      answers: this.fb.array([])  // ✅ Utilisation de FormArray pour stocker les réponses
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  // Charger tous les quiz
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe(
      (data) => { this.quizzes = data; },
      (error) => { console.error('❌ Erreur lors du chargement des quiz', error); }
    );
  }

  // Récupérer `answers` comme `FormArray`
  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  // Ajouter une réponse vide avec un état `isCorrect`
  addAnswer(): void {
    this.answers.push(
      this.fb.group({
        answerText: ['', Validators.required],
        isCorrect: [false] // ✅ Définit `false` par défaut
      })
    );
  }

  // Supprimer une réponse par son index
  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  // Soumettre la question avec ses réponses
  onSubmit(): void {
    const quizId = Number(this.questionForm.get('quizId')?.value);

    if (!quizId || isNaN(quizId)) {
        console.error("❌ Erreur : Aucun quiz sélectionné !");
        return;
    }

    if (this.questionForm.valid && this.answers.length > 0) {

        const newQuestion: QuizQuestion = {
            idQuizQ: undefined, // Optionnel pour un nouvel enregistrement
            questionText: this.questionForm.get('questionText')?.value,
            maxGrade: this.questionForm.get('maxGrade')?.value
        };

        // ✅ Convertir `true/false` en `1/0` pour le backend
        const answersArray: QuizAnswer[] = this.answers.value.map(answer => ({
            ...answer,
            correct: answer.isCorrect        }));

        console.log("✅ Réponses envoyées :", answersArray);

        this.quizQuestionService.addQuestionWithAnswers(quizId, newQuestion, answersArray).subscribe(
            () => {
                console.log('✅ Question ajoutée avec succès');
                this.questionForm.reset();
                this.answers.clear();
            },
            (error) => {
                console.error('❌ Erreur lors de l\'ajout de la question', error);
            }
        );
    } else {
        console.warn("⚠️ Veuillez remplir tous les champs et ajouter au moins une réponse !");
    }
}


  // Rediriger vers la gestion des quiz
  manageQuizzes(): void {
    window.location.href = "/QuizManagement";
  }
}
