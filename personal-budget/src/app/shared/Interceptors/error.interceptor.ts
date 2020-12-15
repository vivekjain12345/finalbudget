import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { NotificationService } from '../notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private notiService: NotificationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const error = err.error.message || err.statusText;
            this.notiService.showErrorMessage('Some Error Occured. Please try again later.')
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                this.notiService.showMessage("Session expired. Please login again.");
            }
            return throwError(error);
        }))
    }
}