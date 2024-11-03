import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.sass'
})
export class NotFoundComponent {

}
