import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InterceptorComponent implements HttpInterceptor {
  constructor(
    private snackbar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {}

  /** Intercept all HTTP requests. Open a snackbar on success or error.*/
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * Check whether the token is valid. If its not, logout and redirect to
     * the login page.
     */
    if (!this.authService.tokenValid()) {
      this.authService.logout();
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          /** Only those answers are to be opened as snackbar which also
              have a message in their body. */
          if (event.body.hasOwnProperty('message')) {
            this.snackbar.openSnackBar(event.body['message']);
          }
        }
      }, error => {
        /** If the backend is not available, you should redirect
            to the offline page. */
        if (error.status === 504) {
          this.router.navigate(['/offline']);
        /** Open a snackbar with the error message.*/
        } else {
          this.snackbar.openSnackBar(error.error.message);
          if (error.status === 401 && error.statusText === 'UNAUTHORIZED') {
            this.authService.logout();
          }
        }
      })
    );
  }
}
