import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { AuthService } from './API/auth.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private socket: Socket | null = null;

    constructor(private authService: AuthService) { }

    /**
     * Conecta el WebSocket usando el token del servicio `AuthService`.
     */
    connect(): void {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No se pudo obtener el token. El usuario no está autenticado.');
            return;
        }

        const config: SocketIoConfig = {
            url: 'http://localhost:3000',
            options: {
                transports: ['websocket'],
                auth: {
                    token: `Bearer ${token}`,
                },
            },
        };

        if (this.socket) {
            this.disconnect();
        }

        this.socket = new Socket(config);

        this.socket.on('connect', () => console.log('Conectado al WebSocket server'));
        this.socket.on('disconnect', (reason: string) => console.log('Desconectado del WebSocket server', reason));
        this.socket.on('connect_error', (error: Error) => console.error('Error de conexión:', error));
    }

    /**
     * Desconecta el WebSocket
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Socket desconectado manualmente');
        }
    }

    /**
     * Escucha eventos del WebSocket
     * @param event Nombre del evento
     * @returns Observable para escuchar el evento
     */
    onEvent<T>(event: string): Observable<T> {
        if (!this.socket) throw new Error('El socket no está conectado');
        return this.socket.fromEvent<T>(event);
    }

    /**
     * Emite eventos al WebSocket
     * @param event Nombre del evento
     * @param data Datos a enviar
     */
    emitEvent(event: string, data: any): void {
        if (!this.socket) throw new Error('El socket no está conectado');
        this.socket.emit(event, data);
    }

    /**
     * Verifica si el socket está conectado
     */
    isConnected(): boolean {
        return this.socket != null;
    }
}
