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
import { forkJoin } from 'rxjs';

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
  isEditing: boolean = false;

  constructor(
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
    private fb: FormBuilder,
    private route: ActivatedRoute // ✅ Injecter ActivatedRoute

  ) {
    this.questionForm = this.fb.group({
      quizId: [{ value: '', disabled: true }, Validators.required], // ✅ Désactivé au chargement
      questionText: ['', [Validators.required, Validators.minLength(2)]], // ✅ Min 2 caractères
      maxGrade: ['', [Validators.required, Validators.min(1)]],
      answers: this.fb.array([
        this.fb.group({
          answerText: ['', [Validators.required, Validators.minLength(2)]], // ✅ Min 2 caractères
          correct: [false] // ✅ Booléen
        })
      ])
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
            correct: this.convertToBoolean(answer.correct) // ✅ Correction ici
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
        correct: [false] // ✅ Initialisé comme `false` (Boolean)
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

    // Vérification si au moins une réponse est fournie
    if (this.answers.length === 0) {
        console.error("❌ Erreur : Une question doit avoir au moins une réponse !");
        return;
    }

    const newQuestion: QuizQuestion = {
        idQuizQ: this.editingQuestion ? this.editingQuestion.idQuizQ : undefined, // ✅ Garde l'ID si édition
        questionText: this.questionForm.get('questionText')?.value,
        maxGrade: this.questionForm.get('maxGrade')?.value,
        quizAnswers: this.answers.value // ✅ Récupère les réponses associées
    };

    // Vérifier si on est en mode édition (editingQuestion a une valeur)
    if (this.editingQuestion) {
        console.log("✏️ Mise à jour de la question :", newQuestion);

        this.updateQuestion(quizId);
        this.updateAnswers(quizId);
    } else {
        console.log("📢 Ajout d'une nouvelle question :", newQuestion);

        this.quizQuestionService.addQuestionWithAnswers(quizId, newQuestion, newQuestion.quizAnswers)
            .subscribe(
                () => {
                    console.log("✅ Nouvelle question ajoutée avec succès !");
                    this.loadQuestionsByQuiz(quizId);
                    this.cancelEdit(); // ✅ Réinitialisation du formulaire
                },
                (error) => console.error("❌ Erreur lors de l'ajout de la question", error)
            );
    }
}


  
  


editQuestion(question: QuizQuestion): void {
  console.log("✏️ Mode édition activé pour la question :", question);

  this.editingQuestion = question;
  this.isEditing = true;

  this.questionForm.patchValue({
    quizId: question.idQuizQ,
    questionText: question.questionText,
    maxGrade: question.maxGrade
  });

  // ✅ Avant d'ajouter de nouvelles réponses, on vide le FormArray
  this.answers.clear();

  this.quizQuestionService.getAnswersByQuestionId(question.idQuizQ).subscribe(
    (answers) => {
      answers.forEach(ans => {
        this.answers.push(
          this.fb.group({
            idQuizA: [ans.idQuizA], // ✅ ID pour l'update
            answerText: [ans.answerText, Validators.required], // ✅ Ajout de validation
            correct: [ans.correct === true] // ✅ S'assurer que c'est un booléen
          })
        );
      });

      console.log("📌 Réponses après ajout au formulaire :", this.answers.value);
    },
    (error) => console.error("❌ Erreur lors du chargement des réponses", error)
  );
}



addEmptyAnswer(): void {
  this.answers.push(
      this.fb.group({
          idQuizA: undefined, // ✅ `undefined` signifie que c'est une nouvelle réponse
          answerText: '',
          correct: false
      })
  );
}




cancelEdit(): void {
  this.editingQuestion = null; // ✅ Désactive le mode édition
  this.isEditing = false; // ✅ Désactive le flag d'édition
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
      const isChecked = answerControl.get('correct')?.value;
  
      console.log(`📢 Checkbox changée pour la réponse ${index}:`, isChecked);
  
      answerControl.patchValue({
        correct: isChecked ? true : false // ✅ Corrige la valeur pour éviter `undefined`
      });
    } else {
      console.warn(`⚠️ Impossible de mettre à jour la réponse à l'index ${index}`);
    }
  }
  
  updateQuestion(quizId: number): void {
    if (!this.editingQuestion) {
        console.error("❌ Erreur : Aucune question en édition !");
        return;
    }

    const updatedQuestion: QuizQuestion = {
        idQuizQ: this.editingQuestion.idQuizQ,
        questionText: this.questionForm.get('questionText')?.value,
        maxGrade: this.questionForm.get('maxGrade')?.value,
        quizAnswers: this.answers.value // ✅ Inclure les réponses ici
    };

    console.log("✏ Mise à jour de la question avec les réponses :", updatedQuestion);

    this.quizQuestionService.updateQuestion(updatedQuestion).subscribe(
        () => {
            console.log('✅ Question mise à jour avec succès');
            this.updateAnswers(quizId); // ✅ Mise à jour des réponses après la question


            setTimeout(() => {
              window.location.reload();
          }, 500);
        },
        (error) => console.error('❌ Erreur lors de la mise à jour de la question', error)
    );
}




updateAnswers(quizId: number): void {
  if (!this.editingQuestion) {
      console.error("❌ Erreur : Aucune question sélectionnée !");
      return;
  }

  const answerUpdateRequests = this.answers.value.map(answer => {
      if (answer.idQuizA) {
          // ✅ Mettre à jour une réponse existante
          return this.quizQuestionService.updateAnswer({
              idQuizA: answer.idQuizA,
              answerText: answer.answerText,
              correct: !!answer.correct,
          });
      } else {
          // ✅ Ajouter une nouvelle réponse
          return this.quizQuestionService.addAnswerToQuestion(this.editingQuestion!.idQuizQ, {
              answerText: answer.answerText,
              correct: !!answer.correct,
          });
      }
  });

  if (answerUpdateRequests.length === 0) {
      console.warn("⚠️ Aucune réponse à mettre à jour !");
      return;
  }

  console.log("🔄 Mise à jour et ajout des réponses en cours...");

  forkJoin(answerUpdateRequests).subscribe(
      () => {
          console.log('✅ Réponses mises à jour et ajoutées avec succès');
          this.loadQuestionsByQuiz(quizId);
          this.cancelEdit();
      },
      (error) => {
          console.error('❌ Erreur lors de la mise à jour des réponses', error);
          alert("❌ Une erreur est survenue lors de la mise à jour des réponses !");
      }
  );
}
}
  
  
  
  

