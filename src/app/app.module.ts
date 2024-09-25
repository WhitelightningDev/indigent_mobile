import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AdditionalDocsPage } from './pages/additional-docs/additional-docs.page';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApplicationImageComponent } from './application-image/application-image.component';
import { ApplicationImagesPage } from './pages/application-images/application-images.page';
import { AuthInterceptor } from './helper/http.interceptor';
import { ToastrModule } from 'ngx-toastr';

export let AppInjector: Injector;
@NgModule({
  declarations: [AppComponent, AdditionalDocsPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
