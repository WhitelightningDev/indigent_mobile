import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiometricsPageRoutingModule } from './biometrics-routing.module';

import { BiometricsPage } from './biometrics.page';
import { FingetprintScanComponent } from './fingetprint-scan/fingetprint-scan.component';
import { PhotoCaptureComponent } from './photo-capture/photo-capture.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiometricsPageRoutingModule,
  ],
  declarations: [
    BiometricsPage,
    FingetprintScanComponent,
    PhotoCaptureComponent,
  ],
})
export class BiometricsPageModule {}
