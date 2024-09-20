import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

import { AppInjector } from '../app.module';
import { AuthenticationService } from '../services/authentication.service';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  template: '',
})
export abstract class BaseComponent {
  protected authService: AuthenticationService;
  protected loader: HTMLIonLoadingElement | null = null;
  protected loadingController: LoadingController;
  private toastController: ToastController;
  private errorToasts: Array<HTMLIonToastElement> = [];
  constructor() {
    //this.authService = AppInjector.get(AuthenticationService);
    //this.loadingController = AppInjector.get(LoadingController);
    this.toastController = AppInjector.get(ToastController);

    this.clearToasts().then();
  }

  async ionViewWillEnter() {
    await this.hideLoading();
    await this.clearToasts();
  }

  protected regexValidator(
    regex: RegExp,
    error: ValidationErrors
  ): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  protected async showLoading(message: string = 'Loading...') {
    this.loader = await this.loadingController.create({
      message: message,
    });
    await this.loader.present();
  }

  protected async hideLoading() {
    if (this.loader) {
      await this.loader.dismiss();
    } else {
      return Promise.resolve();
    }
  }

  protected async clearToasts() {
    this.errorToasts.forEach((toastr) => {
      this.toastController.dismiss(null, undefined, toastr.id);
    });
    this.errorToasts = [];
  }

  protected async showErrorToast(errorMessage: string) {
    let toast = await this.toastController.create({
      message: errorMessage,
      position: 'top',
      duration: 5000,
      color: 'danger',
      buttons: [
        {
          role: 'cancel',
          text: 'Ok',
        },
      ],
    });

    await toast.present();
  }

  protected async showInfoToast(infoMessage: string) {
    let toast = await this.toastController.create({
      message: infoMessage,
      position: 'top',
      duration: 3000,
      color: 'tertiary',
      buttons: [
        {
          role: 'cancel',
          text: 'Ok',
        },
      ],
    });

    await toast.present();
  }

  protected async showSuccessToast(message: string) {
    let toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 5000,
      color: 'success',
      buttons: [
        {
          role: 'cancel',
          text: 'Ok',
        },
      ],
    });

    await toast.present();
  }

  protected stripFileEncoding(fileData: string): string {
    // return fileData.split('data:image/png;base64,')
    return fileData.split(';base64,')[1];
  }
}
