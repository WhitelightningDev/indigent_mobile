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
  constructor(private navController: NavController, private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/biometrics', '0105095166085']).then(() => {
      window.location.reload(); // Reload the page
    });
  }
}
