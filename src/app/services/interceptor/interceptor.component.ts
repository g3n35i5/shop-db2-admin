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

@Injectable()
export class InterceptorComponent implements HttpInterceptor {
  constructor(
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  /** Intercept all HTTP requests. Open a snackbar on success or error.*/
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          /** Only those answers are to be opened as snackbar which also
              have a message in their body. */
          if (event.body.hasOwnProperty('message')) {
            this.snackbar.openSnackBar(event.body['message'], '', 'success');
          }
        }
      }, error => {
        /** If the backend is not available, you should redirect
            to the offline page. */
        if (error.status === 504) {
          this.router.navigate(['/offline']);
        /** Open a snackbar with the error message.*/
        } else {
          this.snackbar.openSnackBar(error.error.message, '', error.error.result);
        }
      })
    );
  }
}
