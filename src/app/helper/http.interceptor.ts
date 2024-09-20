import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const authReq = req.clone({
      setHeaders: {
        //Content_type: 'application/json',
        Auth_Key: '745424A4-65D7-4CC0-B4DE-8EE08074F865',
      },
    });

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
