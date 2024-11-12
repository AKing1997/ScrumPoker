import { Component } from '@angular/core';
import { MenuItem, SideNavComponent } from '../../components/side-nav/side-nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'GuesMainLayout',
  standalone: true,
  imports: [
    RouterModule,
    SideNavComponent
  ],
  template: `
    <GuesSideNav [menuItems]="menuItems">
      <router-outlet></router-outlet>
    </GuesSideNav>
  `
})
export class MainLayoutComponent {
  menuItems: MenuItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'meeting_room', label: 'Room', route: '/room' },
    { icon: 'groups', label: 'Groups', route: '/team' },
    // { icon: 'settings', label: 'Settings', route: '/settings' },
    // { icon: 'info', label: 'About', route: '/about' }
  ];
}
