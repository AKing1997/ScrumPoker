import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SP } from '../../../configurations/configApiSP';
import { User } from '../../interfaces/API/user.interface';


@Injectable({
    providedIn: 'root'
})
export class UserApiService {
    private apiUrl = API_SP.URL.USER;

    constructor(private http: HttpClient) { }

    signUp(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/sign-up`, user);
    }

    getUserByEmail(email: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/email/${email}`);
    }

    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/username/${username}`);
    }

    getUserDataByToken(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/getUserDataByToken`);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/id/${id}`);
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }
}
