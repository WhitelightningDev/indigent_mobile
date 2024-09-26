/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private backButtonSubscription: Subscription; // Subscription for hardware back button
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private platform: Platform // Inject Platform to handle hardware back button
  ) {
    this.credentials = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    // Initialize the custom back button handler when the page is fully loaded
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unsubscribe when leaving the page to prevent multiple subscriptions
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const email = this.credentials.get('email')?.value;
    const password = this.credentials.get('password')?.value;

    if (!email || !password) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: 'Email or password is missing.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    this.authService.login(email, password).subscribe(
      async () => {
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (error) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: error.message || 'An unexpected error occurred.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  initializeBackButtonCustomHandler() {
    // Subscribe to the hardware back button
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        // Call goBack when back button is pressed
        this.goBack();
      });
  }

  goBack() {
    // Exit the app when the back button is pressed on the login page
    navigator['app'].exitApp();
  }
}
