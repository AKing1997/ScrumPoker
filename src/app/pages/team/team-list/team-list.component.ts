import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { DialogData, StandardDialogComponent } from '../../../components/standard-dialog/standard-dialog.component';
import { NameAndDescFormComponent } from '../../../components/templates/name-desc-form.component';
import { Team } from '../../../interfaces/API/team.interface';
import { TeamApiService } from '../../../services/API/team-api.service';
import { ToastService } from '../../../services/ToastService.service';
import { UserApiService } from '../../../services/API/user-api.service';
import { User } from '../../../interfaces/API/user.interface';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    FormsModule,
    MatDialogModule,
    RouterLink,
    MatIconModule,
    MatCardModule,],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.sass'
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  currentUser: User | null = null;
  private readonly userApiService = inject(UserApiService);
  private readonly teamApiService = inject(TeamApiService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  ngOnInit() {
    this.loadCurrentUser();
    this.loadUserTeams();
  }

  createTeam(): void {
    const dialogData: DialogData = {
      title: 'Create new team',
      content: NameAndDescFormComponent,
      confirmText: 'Acept',
      cancelText: 'Cancel'
    };
    this.openDialog(dialogData, this.saveTeam.bind(this));
  }

  currentUserInCurrentTeam(team: Team) {
    if (team.user?.id == this.currentUser?.id)
      return true;

    return team.members?.some(user => user.id == this.currentUser?.id);
  }

  joinTeam(teamId: number | undefined) {
    if (teamId === undefined) return;
    this.teamApiService.joinTeam(teamId).subscribe({
      next: (createdTeam) => {
        this.loadUserTeams();
        this.toastService.success('Successfully joined the team');
      },
      error: (err) => {
        this.toastService.error('There was an error joining the team');
      }
    });
  }

  private loadCurrentUser(): void {
    this.userApiService.getUserDataByToken().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error retrieving room:', error);
      }
    })
  }

  private loadUserTeams(): void {
    this.teamApiService.getTeams().subscribe({
      next: (data: any[]) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
      }
    });
  }

  private saveTeam(result: any): void {
    const newRoom: Team = {
      name: result.name,
      description: result.description
    };

    this.teamApiService.createTeam(newRoom).subscribe({
      next: (createdTeam) => {
        this.loadUserTeams();
        this.toastService.success('Team has been successfully created');
      },
      error: (err) => {
        this.toastService.error('There was an error creating the team');
      }
    });
  }

  private openDialog(dialogData: DialogData, onSuccess: (result: any) => void): void {
    const dialogRef = this.dialog.open(StandardDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        onSuccess(result);
      }
    });
  }
}