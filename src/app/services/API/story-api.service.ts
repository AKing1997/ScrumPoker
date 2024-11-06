import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_SP } from '../../../configurations/api-config-endpoints';
import { CreateStory, Story } from '../../interfaces/API/story.interface';

@Injectable({
    providedIn: 'root'
})
export class StoryApiService {
    private apiUrl = `${API_SP.URL.STORY}`;
    private http: HttpClient = inject(HttpClient)

    createStory(createStoryDto: CreateStory): Observable<Story> {
        return this.http.post<Story>(this.apiUrl, createStoryDto);
    }

    getStoryById(id: number): Observable<Story> {
        return this.http.get<Story>(`${this.apiUrl}/${id}`);
    }

    getStoriesByRoomAndUser(roomId: number, userId: number): Observable<Story[]> {
        return this.http.get<Story[]>(this.apiUrl, {
            params: { roomId: roomId.toString(), userId: userId.toString() }
        });
    }

    updateStory(id: number, updateStoryDto: CreateStory): Observable<Story> {
        return this.http.put<Story>(`${this.apiUrl}/${id}`, updateStoryDto);
    }

    deleteStory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
