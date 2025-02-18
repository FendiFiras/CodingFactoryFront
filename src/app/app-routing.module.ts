import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { LoginPageComponent } from './front/login-page/login-page.component';
import { TrainingManagementComponent } from './demo/training-management/training-management/training-management.component';
import {AddTrainingComponent} from './demo/training-management/add-training/add-training.component'
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' // This ensures an exact match for the empty path
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'TrainingManagement',
    component: TrainingManagementComponent,
    children:[]
  },
  {
    path: 'Add_T',
    component: AddTrainingComponent,
    children:[]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  

  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
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
