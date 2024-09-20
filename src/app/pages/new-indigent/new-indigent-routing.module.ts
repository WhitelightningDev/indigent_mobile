import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewIndigentPage } from './new-indigent.page';

const routes: Routes = [
  {
    path: '',
    component: NewIndigentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewIndigentPageRoutingModule {}
