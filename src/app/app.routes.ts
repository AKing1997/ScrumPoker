import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { authGuard } from './guard/auth-guard.guard';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { authGuardDeactive } from './guard/auth-guard-deactive.guard';
import { RoomComponent } from './pages/room/room.component';

const publicRoutes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'sign-in', component: SignInComponent, canActivate: [authGuardDeactive] },
    { path: 'sign-up', component: SignUpComponent, canActivate: [authGuardDeactive] },
];

const protectedRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'room/:id', component: RoomComponent, canActivate: [authGuard] },
];

export const routes: Routes = [
    ...publicRoutes,
    ...protectedRoutes,
    { path: '**', component: NotFoundComponent },
];
