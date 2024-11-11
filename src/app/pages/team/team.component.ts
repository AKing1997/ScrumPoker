import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterModule, RouterLink } from '@angular/router';
import { ToastService } from '../../services/ToastService.service';
import { NameAndDescFormComponent } from '../../components/templates/name-desc-form.component';
import { DialogData, StandardDialogComponent } from '../../components/standard-dialog/standard-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { Team } from '../../interfaces/API/team.interface';
import { TeamApiService } from '../../services/API/team-api.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    RouterModule,
  ],
  template: '<router-outlet></router-outlet>',
})
export class TeamComponent { }
