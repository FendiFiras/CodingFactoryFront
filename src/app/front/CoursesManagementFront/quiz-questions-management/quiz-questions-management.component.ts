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

    const updatingQuestion = this.editingQuestion &&
                             (this.questionForm.get('questionText')?.value !== this.editingQuestion.questionText ||
                              this.questionForm.get('maxGrade')?.value !== this.editingQuestion.maxGrade);

    const updatingAnswers = this.answers.controls.some(control => control.dirty); // Si au moins une réponse a changé

    // 🎯 Cas 1 : Mise à jour uniquement de la question
    if (updatingQuestion && !updatingAnswers) {
        this.updateQuestion(quizId);
    }
    // 🎯 Cas 2 : Mise à jour uniquement des réponses
    else if (!updatingQuestion && updatingAnswers) {
        this.updateAnswers(quizId);
    }
    // 🎯 Cas 3 : Mise à jour des deux (question + réponses)
    else if (updatingQuestion && updatingAnswers) {
        this.updateQuestion(quizId);
        this.updateAnswers(quizId);
    }
    // 🎯 Cas 4 : Rien n'a changé, annulation
    else {
        console.warn("⚠️ Aucune modification détectée !");
    }
}




  
  


editQuestion(question: QuizQuestion): void {
  this.editingQuestion = question;

  // ✅ Trouver le quiz correspondant pour afficher son nom
  const selectedQuiz = this.quizzes.find(quiz => quiz.idQuiz === question.idQuizQ);
  if (selectedQuiz) {
      this.selectedQuizName = selectedQuiz.quizName;
  }

  this.questionForm.patchValue({
      quizId: question.idQuizQ,
      questionText: question.questionText,
      maxGrade: question.maxGrade
  });

  this.answers.clear();

  // ✅ Récupérer uniquement les réponses de cette question
  this.quizQuestionService.getAnswersByQuestionId(question.idQuizQ).subscribe(
      (answers) => {
          answers.forEach(ans => {
              this.answers.push(
                  this.fb.group({
                      idQuizA: ans.idQuizA, // ✅ Garde l'ID pour l'update
                      answerText: ans.answerText,
                      isCorrect: this.convertToBoolean(ans.correct)
                  })
              );
          });

          // ✅ Ajouter une réponse vide (nouvelle réponse) lors de l'édition
          this.addEmptyAnswer();
      },
      (error) => console.error("❌ Erreur lors du chargement des réponses", error)
  );

  // ✅ Change le titre du formulaire en mode édition
  this.isEditing = true;
}
addEmptyAnswer(): void {
  this.answers.push(
      this.fb.group({
          idQuizA: undefined, // ✅ `undefined` signifie que c'est une nouvelle réponse
          answerText: '',
          isCorrect: false
      })
  );
}



cancelEdit(): void {
  this.editingQuestion = null;
  this.isEditing = false; // ✅ Revenir en mode "Ajout"
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
  updateQuestion(quizId: number): void {
    if (!this.editingQuestion) {
        console.error("❌ Erreur : Aucune question en édition !");
        return;
    }

    const updatedQuestion: QuizQuestion = {
        idQuizQ: this.editingQuestion.idQuizQ,
        questionText: this.questionForm.get('questionText')?.value,
        maxGrade: this.questionForm.get('maxGrade')?.value,
        quizAnswers: [] // ⚠️ On ne met pas à jour les réponses ici
    };

    console.log("✏ Mise à jour de la question :", updatedQuestion);

    this.quizQuestionService.updateQuestion(updatedQuestion).subscribe(
        () => {
            console.log('✅ Question mise à jour avec succès');

            // ⬇️ Mise à jour locale pour un meilleur affichage immédiat
            this.questions = this.questions.map(q => 
                q.idQuizQ === updatedQuestion.idQuizQ ? { ...q, ...updatedQuestion } : q
            );

            this.cancelEdit(); // ✅ Réinitialise le formulaire après mise à jour
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
              correct: !!answer.isCorrect,
          });
      } else {
          // ✅ Ajouter une nouvelle réponse
          return this.quizQuestionService.addAnswerToQuestion(this.editingQuestion!.idQuizQ, {
              answerText: answer.answerText,
              correct: !!answer.isCorrect,
          });
      }
  }).filter(request => request !== null);

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
      (error) => console.error('❌ Erreur lors de la mise à jour des réponses', error)
  );
}



  }
  
  
  
  

