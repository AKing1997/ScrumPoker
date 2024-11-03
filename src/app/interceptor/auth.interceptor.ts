// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/API/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const snackBar = inject(MatSnackBar);

    const authToken = authService.getToken();
    let authReq = req;

    if (authToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`,
            },
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocurrió un error desconocido';

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Error: ${error.error.message}`;
            } else {
                errorMessage = `Error ${error.status}: ${error.message}`;
            }

            snackBar.open(errorMessage, 'Cerrar', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
            });

            return throwError(() => new Error(errorMessage));
        })
    );
};