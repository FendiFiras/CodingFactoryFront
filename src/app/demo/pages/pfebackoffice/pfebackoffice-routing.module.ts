import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'offerlist',
          loadComponent: () => import('./offerslist/offerslist.component').then(m => m.OfferslistComponent) // Ensure the correct component name
        }
      ]
    }
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class pfebackofficeroutingModule {}
