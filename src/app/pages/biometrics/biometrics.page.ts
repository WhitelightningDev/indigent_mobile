import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular'; // Import the Platform service
import { Subscription } from 'rxjs'; // Import Subscription to handle the back button subscription

@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.page.html',
  styleUrls: ['./biometrics.page.scss'],
})
export class BiometricsPage implements OnInit, OnDestroy {
  private hasRefreshed: boolean = false;
  private backButtonSubscription: Subscription; // To manage back button listener

  constructor(
    private navController: NavController,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.initializeBackButtonCustomHandler(); // Initialize back button listener
  }

  ngOnDestroy() {
    // Clean up the back button subscription when the component is destroyed
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  initializeBackButtonCustomHandler() {
    // Subscribe to the platform's back button event
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.goBack(); // Call goBack() when the hardware back button is pressed
      });
  }

  goBack() {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed') === 'true';

    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('hasRefreshed');
      this.router.navigate(['.']); // Navigate to the home page
    }
  }
}
