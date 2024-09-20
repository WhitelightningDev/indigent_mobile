import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewIndigentPageRoutingModule } from './new-indigent-routing.module';

import { NewIndigentPage } from './new-indigent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewIndigentPageRoutingModule,
  ],
  declarations: [NewIndigentPage],
})
export class NewIndigentPageModule {}
