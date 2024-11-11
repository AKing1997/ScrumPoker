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
import { Room } from '../../../interfaces/API/room.interface';
import { RoomApiService } from '../../../services/API/room-api.service';
import { ToastService } from '../../../services/ToastService.service';
import { User } from '../../../interfaces/API/user.interface';
import { UserApiService } from '../../../services/API/user-api.service';

@Component({
  selector: 'app-room-list',
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
    MatCardModule,
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.sass'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  currentUser: User | null = null;
  private readonly userApiService = inject(UserApiService);
  private readonly roomApiService = inject(RoomApiService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  ngOnInit() {
    this.loadCurrentUser();
    this.loadUserRooms();
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

  currentUserInCurrentRoom(room: Room) {
    if (room.user?.id == this.currentUser?.id)
      return true;

    return room.teams?.some(tema => tema.members?.some(user => user.id == this.currentUser?.id));
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

  private loadUserRooms(): void {
    this.roomApiService.getRooms().subscribe({
      next: (data: any[]) => {
        this.rooms = data;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
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
