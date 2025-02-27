import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { LoginPageComponent } from './front/login-page/login-page.component';
import { BecomepartnerComponent } from './front/pfe-front/becomepartner/becomepartner.component';
import { PartnershiplistComponent } from './demo/pages/pfebackoffice/partnershiplist/partnershiplist.component';
import { PfemanagmentComponent } from './demo/pages/pfebackoffice/pfemanagment/pfemanagment.component';
import { AboutUsPfeComponent } from './front/pfe-front/about-us-pfe/about-us-pfe.component';
import { AddofferComponent } from './front/pfe-front/addoffer/addoffer.component';
import { StudentOffersComponent } from './front/pfe-front/student-offers/student-offers.component';
import { ApplicationFormComponent } from './front/pfe-front/application-form/application-form.component';
import { AplicationsucsessComponent } from './front/pfe-front/aplicationsucsess/aplicationsucsess.component';
import { ManageOffersComponent } from './front/pfe-front/manage-offers/manage-offers.component';
import { AplicationforCRComponent } from './front/pfe-front/aplicationfor-cr/aplicationfor-cr.component';
import { AssignmentsforCRComponent } from './front/pfe-front/assignmentsfor-cr/assignmentsfor-cr.component';

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
  { path: 'studentoffers', component: StudentOffersComponent },
  { path: 'apply/:offerId', component: ApplicationFormComponent }, // Route for application form
  { path: 'applictiondone', component: AplicationsucsessComponent }, // Route for application susess
  { path: 'manageoffers', component: ManageOffersComponent }, 


  {
    path: 'becomepartner',
    component: BecomepartnerComponent
  },
  { path: 'assignments/:offerId', component: AssignmentsforCRComponent }, // Add this route
  { path: 'applicationsforCR/:offerId', component: AplicationforCRComponent }, // Add this route

  {
    path: 'welcompartner',
    component: AboutUsPfeComponent
  },  {
    path: 'addoffer',
    component: AddofferComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },

  { path: 'Affectationslist', component: AssignmentsforCRComponent },
  {
    path: '',
    component: AdminComponent,
    children: [
   
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },   
      {
        path: 'pfemanagment',
        loadComponent: () => import('./demo/pages/pfebackoffice/pfemanagment/pfemanagment.component').then((c) => c.PfemanagmentComponent)
      } ,
      {
        path: 'partnerships',
        loadComponent: () => import('./demo/pages/pfebackoffice/partnershiplist/partnershiplist.component').then((c) => c.PartnershiplistComponent)
      },  {
        path: 'offerslist',
        loadComponent: () => import('./demo/pages/pfebackoffice/offerslist/offerslist.component').then((c) => c.OfferlistComponent)
      } , 
      {
        path: 'applications',
        loadComponent: () => import('./demo/pages/pfebackoffice/application-list/application-list.component').then((c) => c.ApplicationListComponent)
      } , 
      {
        path: 'pfeaffectations',
        loadComponent: () => import('./demo/pages/pfebackoffice/assignment-list/assignment-list.component').then((c) => c.AssignmentListComponent)
      } , 
      {
        path: 'evaluations',
        loadComponent: () => import('./demo/pages/pfebackoffice/evaluation-list/evaluation-list.component').then((c) => c.EvaluationListComponent)
      } , 
   
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
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
