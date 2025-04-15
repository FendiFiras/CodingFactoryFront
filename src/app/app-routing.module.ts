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

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' // Redirection vers 'home' si le path est vide
  },
  {
    path: 'home',
    component: HomeComponent
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
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],  // Application du guard ici
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
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
