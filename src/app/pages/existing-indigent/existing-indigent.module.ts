import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExistingIndigentPageRoutingModule } from './existing-indigent-routing.module';

import { ExistingIndigentPage } from './existing-indigent.page';
import { DxCircularGaugeModule } from 'devextreme-angular';
import { ApplicationImagesPage } from '../application-images/application-images.page';
import { ApplicationImageComponent } from 'src/app/application-image/application-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExistingIndigentPageRoutingModule,
    ReactiveFormsModule,
    DxCircularGaugeModule,
  ],
  declarations: [
    ExistingIndigentPage,
    ApplicationImagesPage,
    ApplicationImageComponent,
  ],
})
export class ExistingIndigentPageModule {}
