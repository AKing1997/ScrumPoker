import config from '../../config.json';
export const API_SP = {
    URL: {
        BASE: config.API_SP.URL.BASE,
        SIGN_IN: config.API_SP.URL.BASE + '/auth/sign-in',
        SIGN_UP: config.API_SP.URL.BASE + '/user/sign-up',
        ROOM: config.API_SP.URL.BASE + '/room',
        USER: config.API_SP.URL.BASE + '/user',
        STORY: config.API_SP.URL.BASE + '/story',
        ESTIMATION_VOTE: config.API_SP.URL.BASE + '/estimation-vote',
        WebSocketUrl: config.API_SP.URL.WebSocketUrl
    },
}