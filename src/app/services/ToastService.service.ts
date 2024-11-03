import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private snackBar: MatSnackBar) { }

    success(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: ['toast-success']
        });
    }

    error(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 30000,
            panelClass: ['toast-error']
        });
    }

    warn(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: ['toast-warn']
        });
    }

    info(message: string): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: ['toast-info']
        });
    }
}