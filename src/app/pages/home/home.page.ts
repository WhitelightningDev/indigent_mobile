import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular'; // Import AlertController for alerts
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private backButtonSubscription: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private platform: Platform, // Inject Platform to handle hardware back button
    private alertController: AlertController // Inject AlertController for alerts
  ) {}

  ngOnInit() {
    // Initialize the custom back button handler when the page is loaded
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unsubscribe when leaving the page to avoid multiple subscriptions
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  initializeBackButtonCustomHandler() {
    // Subscribe to the hardware back button
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        // Call method to go to the login page when back button is pressed
        this.navigateToLogin();
      });
  }

  navigateToLogin() {
    // Navigate to the login page (assuming '/' is the login route)
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      cssClass: 'alert-ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // User canceled the logout
            console.log('Logout canceled');
          },
        },
        {
          text: 'Yes',
          handler: async () => {
            // If user confirms logout
            await this.authService.logout();

            const secondAlert = await this.alertController.create({
              header: 'Before You Go!',
              message: 'Do you want to go to the login page or close the app?',
              cssClass: 'alert-ios',
              buttons: [
                {
                  text: 'Close App',
                  role: 'destructive', // Highlighted style for critical action
                  handler: () => {
                    navigator['app'].exitApp(); // Close the app
                  },
                },
                {
                  text: 'Go to Login',
                  handler: () => {
                    this.router.navigateByUrl('/login', { replaceUrl: true }); // Navigate to login page
                  },
                },
              ],
            });

            await secondAlert.present(); // Show the second alert
          },
        },
      ],
    });

    await alert.present(); // Show the first alert
  }
}

/**
 * Thank you for everything.
 * Goodbye and all the best! -Stephan-
 */
