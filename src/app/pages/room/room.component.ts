import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomApiService } from '../../services/API/room-api.service';
import { ToastService } from '../../services/ToastService.service';
import { SocketService } from '../../services/socket.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, StandardDialogComponent } from '../../components/standard-dialog/standard-dialog.component';
import { NameAndDescFormComponent } from '../../components/templates/name-desc-form.component';
import { StoryApiService } from '../../services/API/story-api.service';
import { CreateStory, Story } from '../../interfaces/API/story.interface';
import { SelectObjectComponent } from '../../components/templates/select-object.component';
import { MatChipsModule } from '@angular/material/chips';
import { Team } from '../../interfaces/API/team.interface';
import { Room } from '../../interfaces/API/room.interface';
import { MatCardModule } from '@angular/material/card';
import { PokerVoteValue } from '../../enums/poker-points.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MatGridListModule, MatListModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, CommonModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent implements OnInit {
  storySelected: Story | null = null;
  pokerValues: PokerVoteValue[] = [
    PokerVoteValue.COFFEE, 0, 1, 2, 3, 5, 8, 13, 21, 34, PokerVoteValue.INFINITY
  ];

  roomId: number = 0;
  private route: ActivatedRoute = inject(ActivatedRoute)
  private readonly dialog = inject(MatDialog);

  private readonly roomApiService = inject(RoomApiService);
  private readonly storyApiService = inject(StoryApiService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly socketService = inject(SocketService);
  room: Room = {
    name: '',
    description: ''
  };
  teams: Team[] = [];
  storys: Story[] = []
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roomId = idParam ? +idParam : 0;
    this.loadTeamObject();
  }



  selectStory(value: Story | null): void {
    if (!value) return;
    this.storySelected = value;
  }

  AddTeam(): void {
    const dialogData: DialogData = {
      title: 'Add team to room',
      content: SelectObjectComponent,
      confirmText: 'Select',
      cancelText: 'Cancel',
      objects: this.teams
    };
    this.openDialog(dialogData, this.SaveAddTeam.bind(this));
  }

  createStory(): void {
    const dialogData: DialogData = {
      title: 'Create new story',
      content: NameAndDescFormComponent,
      confirmText: 'Acept',
      cancelText: 'Cancel'
    };
    this.openDialog(dialogData, this.saveStory.bind(this));
  }

  private loadTeamObject() {
    this.roomApiService.getRoomByIdAndValidateAccess(this.roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.storys = room.stories ? room.stories : [];
        this.teams = room.teams ? room.teams : [];
      },
      error: (error) => {
        console.error('Error retrieving room:', error);
      }
    });
  }

  private SaveAddTeam(result: any): void {
    this.roomApiService.addTeamToRoom(this.roomId, result.id).subscribe({
      next: (createdStory) => {
        this.loadTeamObject();
        this.toastService.success('Story has been successfully created');
      },
      error: (err) => {
        this.toastService.error('There was an error creating the story');
      }
    });
  }

  private saveStory(result: any): void {
    const newStory: CreateStory = {
      title: result.name,
      description: result.description,
      roomId: this.roomId
    };

    this.storyApiService.createStory(newStory).subscribe({
      next: (createdStory) => {
        this.loadTeamObject();
        this.toastService.success('Story has been successfully created');
      },
      error: (err) => {
        this.toastService.error('There was an error creating the story');
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