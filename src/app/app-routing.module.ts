import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { LoginPageComponent } from './front/login-page/login-page.component';
import { ReclamationAddComponent } from './front/reclamation/reclamation-add/reclamation-add.component';
import { ReclamationComponent } from './demo/reclamation/reclamation/reclamation.component';
import { ReclamationEditComponent } from './demo/reclamation/reclamation-edit/reclamation-edit.component';

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
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./demo/supplier/supplier-list/supplier-list.component').then(c => c.SupplierListComponent)
      },
      {
        path: 'supplier-form',
        loadComponent: () => import('./demo/supplier/supplier-form/supplier-form.component').then(c => c.SupplierFormComponent)
      },
      {
        path: 'supplier-form/:id',
        loadComponent: () => import('./demo/supplier/supplier-form/supplier-form.component').then(c => c.SupplierFormComponent)
      },
      {
        path: 'materials',
        loadComponent: () => import('./demo/material/material-list/material-list.component').then(c => c.MaterialListComponent)
      },
      {
        path: 'material-form',
        loadComponent: () => import('./demo/material/material-form/material-form.component').then(c => c.MaterialFormComponent)
      },
      {
        path: 'material-form/:id',
        loadComponent: () => import('./demo/material/material-form/material-form.component').then(c => c.MaterialFormComponent)
      },
      {
          path: 'admin/reclamations',
          loadComponent: () => import('./demo/reclamation/reclamation/reclamation.component').then(c => c.ReclamationComponent)
      },
      {
          path: 'admin/reclamation-edit/:id',
          loadComponent: () => import('./demo/reclamation/reclamation-edit/reclamation-edit.component').then(c => c.ReclamationEditComponent)
      },
      {
          path: 'admin/chat',
          loadComponent: () => import('./demo/reclamation/chat/chat.component').then(c => c.ChatComponent)
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
      },
      {
        path: 'user/reclamations',
        loadComponent: () => import('./front/reclamation/reclamation-list/reclamation-list.component').then(c => c.ReclamationListComponent)
      },
      {
        path: 'user/reclamation-edit/:id',
        loadComponent: () => import('./front/reclamation/reclamation-edit/reclamation-edit.component').then(c => c.ReclamationEditComponent)
      },
      {
        path: 'user/reclamations/add',
        loadComponent: () => import('./front/reclamation/reclamation-add/reclamation-add.component').then(c => c.ReclamationAddComponent)
      },
      {
        path: 'user/chat',
        loadComponent: () => import('./front/reclamation/chat/chat.component').then(c => c.ChatComponent)
      },
    ]
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
