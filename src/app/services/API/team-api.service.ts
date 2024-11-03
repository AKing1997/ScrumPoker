import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SP } from '../../../configurations/configApiSP';
import { Team } from '../../interfaces/API/team.interface';

@Injectable({
    providedIn: 'root'
})
export class TeamApiService {
    private apiUrl = API_SP.URL.BASE + '/team';

    constructor(private http: HttpClient) { }

    // Create a new team
    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(`${this.apiUrl}`, team);
    }

    // Get a single team by ID
    getTeam(id: number): Observable<Team> {
        return this.http.get<Team>(`${this.apiUrl}/${id}`);
    }

    // Update an existing team by ID
    updateTeam(id: number, team: Team): Observable<Team> {
        return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
    }

    // Delete a team by ID
    deleteTeam(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getUserTeams(): Observable<Team[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user-teams`);
    }
}