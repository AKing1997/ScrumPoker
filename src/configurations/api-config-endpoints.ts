import { environment } from '../environments/environment';

export const API_SP = {
    URL: {
        BASE: environment.API_SP.URL.BASE,
        SIGN_IN: `${environment.API_SP.URL.BASE}/auth/sign-in`,
        SIGN_UP: `${environment.API_SP.URL.BASE}/user/sign-up`,
        ROOM: `${environment.API_SP.URL.BASE}/room`,
        USER: `${environment.API_SP.URL.BASE}/user`,
        STORY: `${environment.API_SP.URL.BASE}/story`,
        ESTIMATION_VOTE: `${environment.API_SP.URL.BASE}/estimation-vote`,
        WebSocketUrl: environment.API_SP.URL.WebSocketUrl
    }
};