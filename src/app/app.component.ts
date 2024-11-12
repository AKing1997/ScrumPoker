import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Devices } from './enums/Devices';
import { AuthService } from './services/API/auth.service';
import { DeviceService } from './services/device.service';
import { Logo } from './interfaces/Logo';
import { MatMenuModule } from '@angular/material/menu';
import { UserApiService } from './services/API/user-api.service';
import { User } from './interfaces/API/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, RouterLink, MatToolbarModule, MatMenuModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  deviceType: Devices = Devices.DESKTOP;
  Devices = Devices;
  currentUser$: Observable<User | null>;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly userApiService = inject(UserApiService);
  authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private subscription: Subscription = new Subscription();
  private deviceService = inject(DeviceService);

  title = 'Scrum Poker';
  logo: Logo = {
    src: 'http://localhost:4200/assets/logo.png',
    alt: 'Scrum Poker Gues',
    hide: true
  };

  constructor() {
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadCurrentUser();
    }
    this.subscription.add(
      this.deviceService.observeDeviceType().subscribe((deviceType: Devices) => {
        this.deviceType = deviceType;
      })
    );
    this.setInitialTheme();
    this.listenForThemeChange();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCurrentUser(): void {
    this.userApiService.getUserDataByToken().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Error retrieving user:', error);
      }
    });
  }

  signIn() {
    this.router.navigate(['sign-in']);
  }

  goHome() {
    console.log('Ir a Home');
  }

  goProfile() {
    console.log('Ir a Perfil');
  }

  goSettings() {
    console.log('Ir a Configuración');
  }

  setInitialTheme(): void {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.updateTheme(prefersDarkScheme);
  }

  listenForThemeChange(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const prefersDarkScheme = e.matches;
      this.updateTheme(prefersDarkScheme);
    });
  }

  updateTheme(isDarkMode: boolean): void {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }
}