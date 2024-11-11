import { inject, Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './API/auth.service';
import { PokerVoteValue } from '../enums/poker-points.enum';
import { environment } from '../../environments/environment';
import { Token } from '@angular/compiler';

@Injectable({
    providedIn: 'root',
})
export class ScrumPokerService {
    private socketConnectedSubject = new BehaviorSubject<boolean>(false);
    isSocketConnected$ = this.socketConnectedSubject.asObservable();
    private eventsConfigured = false;
    private authService: AuthService = inject(AuthService);
    private socketConfig: SocketIoConfig = {
        url: environment.API_SP.URL.WebSocketUrl,
        options: {
            transports: ['websocket'],
            auth: {
                token: `Bearer ${this.authService.getToken()}`
            }
        }
    };
    private socket: Socket = new Socket(this.socketConfig);

    constructor() {
        this.connect();
    }

    /**
     * Conecta el cliente a WebSocket.
     * Esta función no requiere implementación adicional, ya que la conexión
     * se maneja automáticamente al instanciar el socket en el módulo.
     */
    connect(): void {
        this.socket.connect();
        this.setupSocketEvents();
    }

    /**
     * Configura los eventos del socket para rastrear la conexión.
     */
    private setupSocketEvents(): void {
        if (this.eventsConfigured) return;

        this.socket.on('connect', () => {
            this.socketConnectedSubject.next(true);
            console.log('Socket conectado exitosamente');
        });

        this.socket.on('disconnect', () => {
            this.socketConnectedSubject.next(false);
            console.log('Socket desconectado');
        });

        this.socket.on('connect_error', (error: any) => {
            console.error('Error al conectar el socket:', error);
            this.socketConnectedSubject.next(false);
        });

        this.eventsConfigured = true;
    }


    /**
     * Desconecta al cliente del WebSocket.
     */
    disconnect(): void {
        this.socket.disconnect();
        console.log('Socket disconnected');
    }

    // Métodos para emitir eventos
    /**
     * Solicita unirse a una sala específica.
     * @param roomId - Identificador de la sala a la que unirse.
     */
    joinRoom(roomId: number): void {
        this.socket.emit('joinRoom', roomId);
    }

    /**
     * Solicita abandonar una sala específica.
     * @param roomId - Identificador de la sala a abandonar.
     */
    leaveRoom(roomId: number): void {
        this.socket.emit('leaveRoom', roomId);
    }

    /**
     * Crea una nueva historia con los datos proporcionados.
     * @param storyData - Datos de la historia a crear.
     */
    createdStory(storyData: any): void {
        this.socket.emit('createdStory', storyData);
    }

    /**
     * Escucha el evento cuando se crea una nueva historia.
     * @returns Un Observable que emite datos de la historia creada.
     */
    onStoryCreated(): Observable<any> {
        return this.socket.fromEvent('storyCreated');
    }

    /**
     * Selecciona una historia en una sala específica.
     * @param storyId - Identificador de la historia a seleccionar.
     * @param roomId - Identificador de la sala en la que se realiza la selección.
     */
    selectStory(storyId: number, roomId: number): void {
        this.socket.emit('storySelected', { storyId, roomId });
    }

    /**
     * Vota por una historia específica en una sala.
     * @param storyId - Identificador de la historia a votar.
     * @param voteValue - Valor del voto.
     * @param roomId - Identificador de la sala donde se vota.
     */
    vote(storyId: number, voteValue: PokerVoteValue, roomId: number): void {
        this.socket.emit('vote', { storyId, voteValue, roomId });
    }


    /**
     * Escucha el evento cuando se actualiza un story selected.
     * @returns Un Observable que emite datos actualizados del select de story.
     */
    onStorySelected(roomId: number): Observable<any> {
        return this.socket.fromEvent(`selectedStory_${roomId}`);
    }

    /**
     * Escucha el evento cuando se actualiza un voto.
     * @returns Un Observable que emite datos actualizados del voto.
     */
    onVoteUpdated(): Observable<any> {
        return this.socket.fromEvent('voteUpdated');
    }

    /**
     * Revela los resultados de la votación para una historia en una sala.
     * @param storyId - Identificador de la historia cuyos resultados se revelan.
     * @param roomId - Identificador de la sala donde se revelan los resultados.
     */
    revealResults(storyId: number, roomId: number): void {
        this.socket.emit('reveal', { storyId, roomId });
    }

    /**
     * Escucha el evento cuando se revelan los resultados en una sala específica.
     * @param roomId - Identificador de la sala para la que se revelan los resultados.
     * @returns Un Observable que emite los resultados revelados.
     */
    onResultsRevealed(roomId: number): Observable<any> {
        return this.socket.fromEvent(`revealResults_${roomId}`);
    }

    /**
     * Escucha mensajes enviados en la sala.
     * @returns Un Observable que emite los mensajes de la sala.
     */
    onRoomMessage(): Observable<any> {
        return this.socket.fromEvent('roomMessage');
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
     * Reconecta el socket utilizando el token de autenticación.
     */
    reconnect(): void {
        const token = this.authService.getToken();
        if (token) {
            this.socket.ioSocket.io.opts.extraHeaders = {
                auth: `Bearer ${token}`
            };
            this.socket.connect();
            console.log('Socket reconnected');
        }
    }
}
