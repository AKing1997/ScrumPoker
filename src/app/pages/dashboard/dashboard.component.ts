import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogData, StandardDialogComponent } from '../../components/standard-dialog/standard-dialog.component';
import { NameAndDescFormComponent } from '../../components/templates/name-desc-form.component';
import { RoomApiService } from '../../services/API/room-api.service';
import { Room } from '../../interfaces/API/room.interface';
import { ToastService } from '../../services/ToastService.service';
import { Team } from '../../interfaces/API/team.interface';
import { TeamApiService } from '../../services/API/team-api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly roomApiService = inject(RoomApiService);
  private readonly teamApiService = inject(TeamApiService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  rooms: any[] = [];
  teams: any[] = [];

  ngOnInit(): void {
    this.loadUserRooms();
    this.loadUserTeams();
  }

  createRoom(): void {
    const dialogData: DialogData = {
      title: 'Create new room',
      content: NameAndDescFormComponent,
      confirmText: 'Acept',
      cancelText: 'Cancel'
    };
    this.openDialog(dialogData, this.saveRoom.bind(this));
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

  private loadUserRooms(): void {
    this.roomApiService.getUserRooms().subscribe({
      next: (data: any[]) => {
        this.rooms = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  private loadUserTeams(): void {
    this.teamApiService.getUserTeams().subscribe({
      next: (data: any[]) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
      }
    });
  }

  private saveRoom(result: any): void {
    const newRoom: Room = {
      name: result.name,
      description: result.description
    };

    this.roomApiService.createRoom(newRoom).subscribe({
      next: (createdRoom) => {
        this.loadUserRooms();
        this.toastService.success('Room has been successfully created');
      },
      error: (err) => {
        this.toastService.error('There was an error creating the room');
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
