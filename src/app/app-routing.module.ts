import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canMatch: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'existing',
    loadChildren: () =>
      import('./pages/existing-indigent/existing-indigent.module').then(
        (m) => m.ExistingIndigentPageModule
      ),
  },
  {
    path: 'new',
    loadChildren: () =>
      import('./pages/new-indigent/new-indigent.module').then(
        (m) => m.NewIndigentPageModule
      ),
  },
  {
    path: 'biometrics/:idnumber',
    loadChildren: () =>
      import('./pages/biometrics/biometrics.module').then(
        (m) => m.BiometricsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
