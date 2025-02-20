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
  questions: QuizQuestion[] = []; //  Liste des questions avec leurs réponses
  questionForm: FormGroup;
  editingQuestion: QuizQuestion | null = null;
  showAnswersIndex: number | null = null; // Garde l'index de la question affichée

  constructor(
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      quizId: ['', Validators.required], //  Ajout manuel car `QuizQuestion` ne l'a pas
      questionText: ['', Validators.required],
      maxGrade: ['', [Validators.required, Validators.min(1)]],
      answers: this.fb.array([]) //  Liste des réponses associées
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
    this.loadQuestions(); //  Récupération des questions et réponses
  }

  //  Charger les quiz existants
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe(
      (data) => { this.quizzes = data; },
      (error) => { console.error(' Erreur lors du chargement des quiz', error); }
    );
  }

  //  Charger toutes les questions
  loadQuestions(): void {
    this.quizQuestionService.getAllQuestions().subscribe( //  Correction `getQuestions()`
      (data) => { this.questions = data; },
      (error) => { console.error(' Erreur lors du chargement des questions', error); }
    );
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    this.answers.push(
      this.fb.group({
        answerText: ['', Validators.required],
        correct: [false]
      })
    );
  }

  //  Supprimer une réponse
  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  onSubmit(): void {
    const quizId = Number(this.questionForm.get('quizId')?.value);

    if (!quizId || isNaN(quizId)) {
        console.error("❌ Erreur : Aucun quiz sélectionné !");
        return;
    }

    if (this.questionForm.valid && this.answers.length > 0) {
        console.log("📌 Formulaire valide. Préparation de la question...");

        const newQuestion: QuizQuestion = {
            idQuizQ: this.editingQuestion ? this.editingQuestion.idQuizQ : undefined,
            questionText: this.questionForm.get('questionText')?.value,
            maxGrade: this.questionForm.get('maxGrade')?.value,
            quizAnswers: this.answers.value.map(answer => {
                console.log(`📢 Vérification AVANT conversion:`, answer);
                return {
                    answerText: answer.answerText,
                    correct: answer.isCorrect ? 1 : 0  // ✅ Assure que `correct` est bien `1/0`
                };
            })
        };

        console.log("🚀 Question prête à être envoyée :", newQuestion);

        if (this.editingQuestion) {
            console.log("✏ Mise à jour de la question en cours...");
            this.quizQuestionService.updateQuestion(newQuestion).subscribe(
                () => {
                    console.log('✅ Question mise à jour avec succès');
                    this.loadQuestions();
                    this.cancelEdit();
                },
                (error) => {
                    console.error('❌ Erreur lors de la mise à jour de la question', error);
                }
            );
        } else {
            console.log("🆕 Ajout d'une nouvelle question en cours...");
            this.quizQuestionService.addQuestionWithAnswers(quizId, newQuestion, newQuestion.quizAnswers).subscribe(
                () => {
                    console.log('✅ Question ajoutée avec succès');
                    this.loadQuestions();
                    this.questionForm.reset();
                    this.answers.clear();
                },
                (error) => {
                    console.error('❌ Erreur lors de l\'ajout de la question', error);
                }
            );
        }
    } else {
        console.warn("⚠️ Veuillez remplir tous les champs et ajouter au moins une réponse !");
    }
}

  
  


  //  Modifier une question
  editQuestion(question: QuizQuestion): void {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      quizId: '', //  Pas dans `QuizQuestion`
      questionText: question.questionText,
      maxGrade: question.maxGrade
    });

    this.answers.clear();
    question.quizAnswers.forEach(ans => {
      this.answers.push(
        this.fb.group({
          answerText: ans.answerText,
          isCorrect: !!ans.isCorrect // ✅ Assure que la valeur reste un `boolean`
        })
      );
    });
  }

  //  Annuler l'édition
  cancelEdit(): void {
    this.editingQuestion = null;
    this.questionForm.reset();
    this.answers.clear();
  }

// Supprimer une question sans confirmation
deleteQuestion(idQuizQ: number): void {
  this.quizQuestionService.deleteQuestion(idQuizQ).subscribe(
    () => {
      console.log('✅ Question supprimée avec succès');
      this.loadQuestions();
    },
    (error) => {
      console.error('❌ Erreur lors de la suppression de la question', error);
    }
  );
}


  //  Redirection vers la gestion des quiz
  manageQuizzes(): void {
    window.location.href = "/QuizManagement";
  }
  // Afficher/Masquer les réponses d'une question
  toggleAnswers(index: number): void {
    this.showAnswersIndex = this.showAnswersIndex === index ? null : index;
  }
  updateCorrectValue(index: number): void {
    const answerControl = this.answers.at(index);
    if (answerControl) {
      const isChecked = answerControl.get('isCorrect')?.value;
  
      console.log(`📢 Checkbox changée pour la réponse ${index}:`, isChecked); // 🔍 Debug
  
      answerControl.patchValue({
        correct: isChecked ? 1 : 0 // ✅ Convertir `true/false` en `1/0`
      });
    }
  }
  
  }
  
  
  
  

