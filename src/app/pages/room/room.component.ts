import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { TeamApiService } from '../../services/API/team-api.service';
import { EstimationVoteApiService } from '../../services/API/estimation-vote-api.service';
import { EstimationVote } from '../../interfaces/API/estimation-vote.interface';
import { User } from '../../interfaces/API/user.interface';
import { AuthService } from '../../services/API/auth.service';
import { UserApiService } from '../../services/API/user-api.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MatGridListModule, MatListModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, CommonModule, MatIconModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.sass'
})
export class RoomComponent implements OnInit, OnDestroy {
  storySelected: Story | null = null;
  pokerValues: PokerVoteValue[] = [
    PokerVoteValue.COFFEE, 0, 1, 2, 3, 5, 8, 13, 21, 34, PokerVoteValue.INFINITY
  ];


  roomId: number = 0;
  private route: ActivatedRoute = inject(ActivatedRoute)
  private readonly dialog = inject(MatDialog);
  private readonly teamApiService = inject(TeamApiService);

  private readonly roomApiService = inject(RoomApiService);
  private readonly userApiService = inject(UserApiService);
  private readonly storyApiService = inject(StoryApiService);
  private readonly estimationVoteApiService = inject(EstimationVoteApiService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly socketService = inject(SocketService);
  currentUser: User | null = null;
  room: Room = {
    name: '',
    description: ''
  };
  teams: Team[] = [];
  storys: Story[] = []
  ngOnInit(): void {
    this.userApiService.getUserDataByToken().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error retrieving room:', error);
      }
    })
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roomId = idParam ? +idParam : 0;
    this.loadRoomObject();
    this.loadTeams();
    this.socketService.connect();
    if (this.socketService.isConnected()) {
      this.socketService.emitEvent('joinRoom', this.roomId);
      this.socketService.onEvent(`newVote_${this.roomId}`).subscribe({
        next: (vote) => {
          this.loadRoomObject();
        },
        error: (error) => {
          console.error('Error al recibir un nuevo voto:', error);
        }
      });

      this.socketService.onEvent(`revealResults_${this.roomId}`).subscribe({
        next: (results) => {
          this.loadRoomObject();
        },
        error: (error) => {
          console.error('Error al recibir los resultados revelados:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  getCurrentUserVoted(userId: number): boolean {
    return this.storySelected?.estimations?.some(estimation => estimation.user.id === userId) ?? false;
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

  selectPointCard(value: PokerVoteValue) {
    if (!this.storySelected?.id && !this.currentUser?.id) return;
    const estimationVote: any = {
      storyId: this.storySelected?.id ?? 0,
      voteValue: value,
      roomId: this.roomId
    }

    this.socketService.emitEvent('vote', estimationVote);
  }

  revelPoint() {
    this.socketService.emitEvent('reveal', {
      storyId: this.storySelected?.id ?? 0,
      roomId: this.roomId
    });
  }

  private loadRoomObject() {
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

  private loadTeams(): void {
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

  private SaveAddTeam(result: any): void {
    this.roomApiService.addTeamToRoom(this.roomId, result.id).subscribe({
      next: (createdStory) => {
        this.loadRoomObject();
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
        this.loadRoomObject();
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