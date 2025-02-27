import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HomeComponent } from './front/home/home.component';
import { LoginPageComponent } from './front/login-page/login-page.component';
import { ListeForumComponent } from './front/Forum-Front/liste-forum/liste-forum.component';

import { ForumService } from 'src/app/service/forum.service';
import { CommonModule } from '@angular/common';
import { ForumDiscussionsComponent } from './front/Forum-Front/forum-discussions/forum-discussions.component';
import { ForumsManagementComponent } from './demo/forums-management/forums-management.component';
import { AdminDiscussionComponent } from './demo/DiscussionsManagement/admin-forum-discussions/admin-forum-discussions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './front/Forum-Front/message-list/message-list.component';
// import { ForumDiscussionsComponent } from './front/Forum-Front/forum-discussions/forum-discussions.component';
// import { FourmsListComponent } from './front/Forum-Front/fourms-list/fourms-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'ListForum',
    component: ListeForumComponent
  },


  { path: 'forum/:forumId',
     component: ForumDiscussionsComponent }, 


  { path: 'admin/forum/:forumId/discussions',
     component: AdminDiscussionComponent },


     { path: 'admin/forum/:forumId/discussions/:discussionId', 
      component: AdminDiscussionComponent },

      {
        path: 'discussion/:discussionId/messages',
        component: MessageComponent
      },
    
 /* { path: 'admin/forum/:forumId/discussions/add',
     component: AdminAddDiscussionComponent },


  { path: 'admin/forum/:forumId/discussions/:discussionId/edit',
     component: AdminAddDiscussionComponent },
    */



 // { path: 'forums-management', component: ForumsManagementComponent },







  /*
  {
    path: 'forum/:id/discussions',
    component: ForumDiscussionsComponent 
  },
  */

 /*
  {
    path: 'ForumsList',
    component: FourmsListComponent
  },
*/
  

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
        path: 'forums-management',
        loadComponent: () => import('./demo/forums-management/forums-management.component').then((m) => m.ForumsManagementComponent)
      },

      {
        path: 'admin-forum-discussions',
        loadComponent: () => import('./demo/DiscussionsManagement/admin-forum-discussions/admin-forum-discussions.component').then((m) => m.AdminDiscussionComponent)
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
  imports: [RouterModule.forRoot(routes), CommonModule, FontAwesomeModule], 
  exports: [RouterModule],
  providers: [ForumService]
})
export class AppRoutingModule {}
