import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { LoginPageComponent } from './front/login-page/login-page.component';

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
