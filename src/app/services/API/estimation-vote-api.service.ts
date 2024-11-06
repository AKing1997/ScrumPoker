import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estimation, EstimationVote } from '../../interfaces/API/estimation-vote.interface';
import { API_SP } from '../../../configurations/api-config-endpoints';

@Injectable({
    providedIn: 'root'
})
export class EstimationVoteApiService {
    private apiUrl = API_SP.URL.ESTIMATION_VOTE;

    constructor(private http: HttpClient) { }

    createEstimationVote(createDto: EstimationVote): Observable<Estimation> {
        return this.http.post<Estimation>(`${this.apiUrl}`, createDto);
    }

    getEstimationVote(id: number): Observable<Estimation> {
        return this.http.get<Estimation>(`${this.apiUrl}/${id}`);
    }

    updateEstimationVote(id: number, updateDto: EstimationVote): Observable<Estimation> {
        return this.http.put<Estimation>(`${this.apiUrl}/${id}`, updateDto);
    }

    deleteEstimationVote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
