import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.credentials = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  async login() {
    if (!this.credentials) {
      return;
    }

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
      async (token) => {
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (error) => {
        await loading.dismiss();
        // Display error alert
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
    return this.credentials?.get('email');
  }

  get password() {
    return this.credentials?.get('password');
  }
}
