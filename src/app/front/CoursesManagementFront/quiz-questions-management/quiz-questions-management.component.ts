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
import { ActivatedRoute } from '@angular/router'; // ✅ Importer ActivatedRoute

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
  selectedQuizName: string = ''; // ✅ Stocke le nom du quiz sélectionné

  constructor(
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
    private fb: FormBuilder,
    private route: ActivatedRoute // ✅ Injecter ActivatedRoute

  ) {
    this.questionForm = this.fb.group({
      quizId: [{ value: '', disabled: true }, Validators.required], // ✅ Désactivé au chargement
      questionText: ['', Validators.required],
      maxGrade: ['', [Validators.required, Validators.min(1)]],
      answers: this.fb.array([]) //  Liste des réponses associées
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
 
    this.route.paramMap.subscribe(params => {
      const quizId = Number(params.get('id'));
      if (!isNaN(quizId)) {
        this.loadQuizDetails(quizId); // ✅ Charger les détails du quiz sélectionné

        this.loadQuestionsByQuiz(quizId);
      }
    });  }

    

  //  Charger les quiz existants
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe(
      (data) => { this.quizzes = data; },
      (error) => { console.error(' Erreur lors du chargement des quiz', error); }
    );
  }

  loadQuestionsByQuiz(quizId: number): void {
    this.quizQuestionService.getQuestionsByQuiz(quizId).subscribe(
      (data) => {
        console.log("📢 Données brutes reçues du backend :", JSON.stringify(data, null, 2));

        // ✅ Normaliser `correct` pour s'assurer qu'il est bien un booléen
        this.questions = data.map(question => ({
          ...question,
          quizAnswers: question.quizAnswers.map(answer => ({
            ...answer,
            isCorrect: this.convertToBoolean(answer.correct) // ✅ Correction ici
          }))
        }));

        console.log("📌 Données après conversion :", this.questions);
      },
      (error) => {
        console.error('❌ Erreur lors du chargement des questions', error);
      }
    );
}

private convertToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value; // ✅ Déjà un booléen
  if (typeof value === 'number') return value === 1; // ✅ Convertir `1` en `true`, `0` en `false`
  if (typeof value === 'string') return value.trim().toLowerCase() === "true"; // ✅ Convertir `"true"` en `true`
  return false; // ✅ Par défaut, `false`
}


// ✅ Charger les détails du quiz sélectionné
loadQuizDetails(quizId: number): void {
  this.quizService.getQuizById(quizId).subscribe(
    (quiz) => {
      this.selectedQuizName = quiz.quizName; // ✅ Met à jour le nom affiché dans l'input
      this.questionForm.patchValue({ quizId: quiz.idQuiz }); // ✅ Met à jour l'ID du quiz
    },
    (error) => {
      console.error("Erreur lors du chargement des détails du quiz", error);
    }
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
        isCorrect: [false] // ✅ Initialisé comme `false` (Boolean)
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
            quizAnswers: this.answers.value.map(answer => ({
                answerText: answer.answerText,
                correct: !!answer.isCorrect // ✅ Assure que `isCorrect` est bien un `boolean`
            }))
        };

        console.log("🚀 Question prête à être envoyée :", newQuestion);

        if (this.editingQuestion) {
            console.log("✏ Mise à jour de la question en cours...");
            this.quizQuestionService.updateQuestion(newQuestion).subscribe(
                () => {
                    console.log('✅ Question mise à jour avec succès');
                    this.loadQuestionsByQuiz(quizId);
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
                    this.loadQuestionsByQuiz(quizId);
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
          isCorrect: !!ans.correct
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
  
  
  
  

