import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.sass'
})
export class LandingComponent {

}
