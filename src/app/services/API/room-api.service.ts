import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../interfaces/API/room.interface';
import { API_SP } from '../../../configurations/api-config-endpoints';

@Injectable({
    providedIn: 'root'
})
export class RoomApiService {
    private apiUrl = API_SP.URL.ROOM;

    constructor(private http: HttpClient) { }

    createRoom(room: Room): Observable<Room> {
        return this.http.post<Room>(`${this.apiUrl}`, room);
    }

    getRoom(id: number): Observable<Room> {
        return this.http.get<Room>(`${this.apiUrl}/${id}`);
    }

    updateRoom(id: number, room: Room): Observable<Room> {
        return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
    }

    deleteRoom(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getUserRooms(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user-rooms`);
    }

    getRoomByIdAndValidateAccess(roomId: number): Observable<Room> {
        return this.http.get<any>(`${this.apiUrl}/${roomId}`);
    }

    addTeamToRoom(roomId: number, teamId: number): Observable<Room> {
        const params = new HttpParams()
            .set('roomId', roomId.toString())
            .set('teamId', teamId.toString());

        return this.http.post<Room>(`${this.apiUrl}/addTeamToRoom`, null, { params });
    }
}