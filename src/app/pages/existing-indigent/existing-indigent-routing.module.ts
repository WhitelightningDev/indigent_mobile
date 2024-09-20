import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExistingIndigentPage } from './existing-indigent.page';

const routes: Routes = [
  {
    path: '',
    component: ExistingIndigentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistingIndigentPageRoutingModule {}
