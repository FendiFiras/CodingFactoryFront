import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { CodingLoginComponent } from './front/UserFront/coding-login/coding-login.component';
import { CodingRegisterComponent } from './front/UserFront/coding-register/coding-register.component';
import { ForgetPasswdComponent } from './front/UserFront/forget-passwd/forget-passwd.component';
import { InstructorComponent } from './front/UserFront/instructor/instructor.component';
import { AdminGuard } from './auth/admin.guard';  // Import du guard
import { LoginPageComponent } from './front/login-page/login-page.component';
import { TrainingManagementComponent } from './demo/training-management/training-management/training-management.component';
import {AddTrainingComponent} from './demo/training-management/add-training/add-training.component'
import {AddSessionComponent}from './demo/training-management/add-session/add-session.component'
import { ListsTrainingComponent} from'./front/trainingFront/lists-training/lists-training.component';
 import {TrainingInfoComponent} from './front/trainingFront/training-info/training-info.component'
 import {CoursesManagementComponent} from './front/CoursesManagementFront/courses-management/courses-management.component'
 import {QuizManagementComponent} from './front/CoursesManagementFront/quiz-management/quiz-management.component'
 import{QuizInterfaceComponent} from './front/CoursesManagementFront/quiz-interface/quiz-interface.component'
import {QuizQuestionsManagementComponent} from './front/CoursesManagementFront/quiz-questions-management/quiz-questions-management.component'
import {CoursesStudentComponent} from './front/CoursesManagementFront/courses-student/courses-student.component'
import {PaymentSuccessComponent} from './front/trainingFront/payment-success-component/payment-success-component.component'
import { StatTrainingComponent } from './demo/training-management/stat-training/stat-training.component';
const routes: Routes = [
 
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'TrainingManagement',
    component: TrainingManagementComponent,
    children:[]
  },
  {path: 'listeventsfront',  // <-- Ajout de la route pour EventsComponent
    loadComponent: () => import('./front/eventfront/listevenement/listevenement.component').then((c) => c.ListevenementComponent) // Chargement du composant Events
  }
  ,
  {path: 'detailseventfront/:id',  // <-- Ajout de la route pour EventsComponent
    loadComponent: () => import('./front/eventfront/detailevent/detailevent.component').then((c) => c.DetaileventComponent) // Chargement du composant Events
  },
  {path: 'planningeventfront/:id',  // <-- Ajout de la route pour EventsComponent
    loadComponent: () => import('./front/eventfront/planning-event/planning-event.component').then((c) => c.PlanningEventComponent) // Chargement du composant Events
  },
  {
    path: 'add-training',
    component: AddTrainingComponent,
    children:[]
  },
  {
    path: 'login',
    component: CodingLoginComponent
  },
  {
    path: 'register',
    component: CodingRegisterComponent
  },
  {
    path: 'becomeainstructor',
    component: InstructorComponent
  },
  {
    path: 'forget',
    component: ForgetPasswdComponent
  },
  {
    path: 'add-session',
    component: AddSessionComponent,
    children:[]
  },
  {
    path: 'TrainingList',
    component: ListsTrainingComponent,
    children:[]
  },
  
  {
    path: 'TrainingInfo/:id',  // 🔹 ID dynamique de la formation
    component: TrainingInfoComponent,
    children:[]
  },

  {
    path: 'CoursesManagement',  
    component: CoursesManagementComponent,
    children:[]
  },


  {
    path: 'QuizManagement',
  
    component: QuizManagementComponent,
    children:[]
  },
  {
    path: 'QuizQuestionsManagement/:id', // ✅ Ajouter l'ID du quiz dans l'URL
    component: QuizQuestionsManagementComponent,
  },

  { path: 'courses/training/:trainingId', 
    component: CoursesStudentComponent },
    { path: 'PassQuiz/:quizId',
       component: QuizInterfaceComponent },// ✅ Passage du quiz avec ID


       { path: 'StatTraining',
        component: StatTrainingComponent },


       { path: 'payment-success', component: PaymentSuccessComponent },


  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      
  {
    path: 'events',  // <-- Ajout de la route pour EventsComponent
    loadComponent: () => import('./demo/Events/add-event/add-event.component').then((c) => c.AddEventComponent) // Chargement du composant Events
  },
  {path: 'listevents',  // <-- Ajout de la route pour EventsComponent
  loadComponent: () => import('./demo/Events/list-event/list-event.component').then((c) => c.ListEventComponent) // Chargement du composant Events
},
{path: 'listlocation',  // <-- Ajout de la route pour EventsComponent
  loadComponent: () => import('./demo/Events/location-event/location-event.component').then((c) => c.LocationEventComponent) // Chargement du composant Events
},

{path: 'feedback/:id',  // <-- Ajout de la route pour EventsComponent
  loadComponent: () => import('./demo/Events/feedback-event/feedback-event.component').then((c) => c.FeedbackEventComponent) // Chargement du composant Events
},


      {
        path: 'listeUsers',
        loadComponent: () => import('./demo/UserBack/liste-users/liste-users.component').then((c) => c.ListeUsersComponent)
      },
      {
        path: 'student',
        loadComponent: () => import('./demo/UserBack/student/student.component').then((c) => c.StudentComponent)
      },
      {
        path: 'instructor',
        loadComponent: () => import('./demo/UserBack/instructor/instructor.component').then((c) => c.InstructorComponent)
      },
      {
        path: 'companyrepresentive',
        loadComponent: () => import('./demo/UserBack/companyreprentive/companyreprentive.component').then((c) => c.CompanyReprentiveComponent)
      },
      {
        path: 'banned-user',
        loadComponent: () => import('./demo/UserBack/banned-user/banned-user.component').then((c) => c.BannedUsersComponent)
      },
      {
        path: 'archive-ban',
        loadComponent: () => import('./demo/UserBack/archive-ban/archive-ban.component').then(m => m.ArchiveBanComponent)
      },
      
      {
        path: 'users-stats',
        loadComponent: () => import('./demo/UserBack/users-stats/users-stats.component').then((c) => c.UsersStatsComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
