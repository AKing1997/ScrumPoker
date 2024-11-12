import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { authGuardDeactive } from './guard/auth-guard-deactive.guard';
import { RoomComponent } from './pages/room/room.component';
import { JoinRoomComponent } from './pages/room/join-room/join-room.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { authGuard } from './guard/auth-guard.guard';
import { TeamComponent } from './pages/team/team.component';
import { TeamListComponent } from './pages/team/team-list/team-list.component';
import { TeamDetailComponent } from './pages/team/team-detail/team-detail.component';
import { RoomListComponent } from './pages/room/room-list/room-list.component';
import { RoomDetailComponent } from './pages/room/room-detail/room-detail.component';

const publicRoutes: Routes = [
    { path: 'home', component: LandingComponent },
    { path: 'sign-in', component: SignInComponent, canActivate: [authGuardDeactive] },
    { path: 'sign-up', component: SignUpComponent, canActivate: [authGuardDeactive] },
];

const protectedRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'room',
                redirectTo: 'room/list',
                pathMatch: 'full',
            },
            {
                path: 'room', component: RoomComponent,
                children: [
                    { path: 'list', component: RoomListComponent },
                    { path: 'detail/:id', component: RoomDetailComponent },
                    { path: 'join/:id', component: JoinRoomComponent },
                ]
            },
            {
                path: 'team',
                redirectTo: 'team/list',
                pathMatch: 'full',
            },
            {
                path: 'team', component: TeamComponent,
                children: [
                    { path: 'list', component: TeamListComponent },
                    { path: 'detail/:id', component: TeamDetailComponent },
                ]
            },

        ]
    },
];

export const routes: Routes = [
    ...publicRoutes,
    ...protectedRoutes,
    { path: '**', component: NotFoundComponent },
];
