import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject, throwError } from 'rxjs';

import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true //Change false to keep on login else true to head to home page
  );

  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .get(
        `https://mabureauonline.co.za/mabcloud/RestServer/RestAPI/Get_Token/${email}/${password}`
      )
      .pipe(
        map((data: any) => {
          // Check if the login was successful
          if (data.result && data.result[0][0] && data.result[0][0].Token) {
            return data.result[0][0].Token;
          } else if (data.result && data.result[0][0]['Login Failed']) {
            // Handle login failure
            throw new Error(data.result[0][0]['Login Failed']);
          } else {
            // Handle unexpected response structure
            throw new Error('Unexpected response from the server.');
          }
        }),
        switchMap((Token) => {
          return from(Preferences.set({ key: TOKEN_KEY, value: Token }));
        }),
        catchError((error) => {
          // Handle any errors from the HTTP request or token handling
          return throwError(
            () => new Error(error.message || 'An unknown error occurred.')
          );
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.remove({ key: TOKEN_KEY });
  }
}
