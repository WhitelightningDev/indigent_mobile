/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.page.html',
  styleUrls: ['./biometrics.page.scss'],
})
export class BiometricsPage implements OnInit {
  private hasRefreshed: boolean = false; // Flag to track refresh state

  constructor(private navController: NavController, private router: Router) {}

  ngOnInit() {}

  goBack() {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed') === 'true';

    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true'); // Set the flag to true after the first click
      window.location.reload(); // Reload the page
    } else {
      sessionStorage.removeItem('hasRefreshed'); // Reset the flag for future clicks
      this.router.navigate(['/new']); // Go back to the previous page
    }
  }
}
