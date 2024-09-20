import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { CanLoad, CanMatch, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanMatch {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canMatch(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}
