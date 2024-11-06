import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_SP } from '../../../configurations/api-config-endpoints';
import { ToastService } from '../ToastService.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'access_token';
    private readonly API_URL = API_SP.URL;

    constructor(private http: HttpClient, private cookieService: CookieService, private toast: ToastService, private router: Router) { }

    login(UserName: string, Password: string): Observable<boolean> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(this.API_URL.SIGN_IN, { UserName, Password }, { headers }).pipe(
            map(response => {
                if (response && response.access_token) {
                    this.setToken(response.access_token);
                    return true;
                }
                this.toast.error('Error en el inicio de sesión: credenciales incorrectas');
                return false;
            }),
            catchError(error => {
                console.error('Error en la petición de login', error);
                this.toast.error('Error en el servidor. Por favor, intenta de nuevo más tarde.');
                return of(false);
            })
        );
    }

    register(UserName: string, Name: string, LastName: string, Email: string, Password: string): Observable<boolean> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(this.API_URL.SIGN_UP, { UserName, Name, LastName, Email, Password }, { headers }).pipe(
            map(response => {
                if (response) {
                    this.toast.success('Registro exitoso');
                    this.login(UserName, Password).subscribe({
                        next: (success) => {
                            if (success) {
                                console.log('Login exitoso');
                                this.router.navigate(['/dashboard']);
                            } else {
                                console.log('Login fallido');
                            }
                        },
                        error: (error) => {
                            console.error('Error en la petición de login', error);
                        }
                    });;
                    return true;
                }
                this.toast.error('Error en el registro: datos inválidos');
                return false;
            }),
            catchError(error => {
                console.error('Error en el registro:', error);
                this.toast.error('Error en el servidor. No se pudo completar el registro.');
                return of(false);
            })
        );
    }



    private setToken(token: string): void {
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 8);
        this.cookieService.set(this.TOKEN_KEY, token, expirationDate, '/', '', true, 'Strict');
    }

    getToken(): string | null {
        return this.cookieService.get(this.TOKEN_KEY) || null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        this.cookieService.delete(this.TOKEN_KEY, '/');
    }
}