import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.page.html',
  styleUrls: ['./biometrics.page.scss'],
})
export class BiometricsPage implements OnInit, OnDestroy {
  private backButtonSubscription: Subscription; // Subscription for hardware back button
  private hasRefreshed: boolean = false; // Flag to track refresh state

  constructor(
    private navController: NavController,
    private router: Router,
    private platform: Platform // Inject Platform to handle hardware back button
  ) {}

  ngOnInit() {
    this.initializeBackButtonCustomHandler();
  }
  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe(); // Clean up back button listener
    }
  }

  initializeBackButtonCustomHandler() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.goBack(); // Call the goBack() method when the hardware back button is pressed
      });
  }

  goBack() {
    // Navigate back to the previous page or perform other logic
    this.router.navigate(['/new']); // Navigate to the 'new' route
  }
}
