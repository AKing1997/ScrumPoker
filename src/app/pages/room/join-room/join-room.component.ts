import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomApiService } from '../../../services/API/room-api.service';
import { ToastService } from '../../../services/ToastService.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, StandardDialogComponent } from '../../../components/standard-dialog/standard-dialog.component';
import { NameAndDescFormComponent } from '../../../components/templates/name-desc-form.component';
import { StoryApiService } from '../../../services/API/story-api.service';
import { CreateStory, Story } from '../../../interfaces/API/story.interface';
import { SelectObjectComponent } from '../../../components/templates/select-object.component';
import { MatChipsModule } from '@angular/material/chips';
import { Team } from '../../../interfaces/API/team.interface';
import { Room } from '../../../interfaces/API/room.interface';
import { MatCardModule } from '@angular/material/card';
import { PokerVoteValue } from '../../../enums/poker-points.enum';
import { CommonModule } from '@angular/common';
import { TeamApiService } from '../../../services/API/team-api.service';
import { User } from '../../../interfaces/API/user.interface';
import { ScrumPokerService } from '../../../services/scrum-poker.service';
import { UserApiService } from '../../../services/API/user-api.service';
import { Subscription } from 'rxjs';
import { GuesListComponent } from "../../../components/gues-list/gues-list.component";

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [MatGridListModule, MatListModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, CommonModule, GuesListComponent],
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinRoomComponent implements OnInit, OnDestroy {
  private socketConnectedSubscription!: Subscription;
  private socketConnected!: boolean;
  storySelected: Story | null = null;
  pokerValues: PokerVoteValue[] = [
    PokerVoteValue.COFFEE, 0, 1, 2, 3, 5, 8, 13, 21, 34, PokerVoteValue.INFINITY
  ];

  roomId: number = 0;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly teamApiService = inject(TeamApiService);
  private readonly roomApiService = inject(RoomApiService);
  private readonly userApiService = inject(UserApiService);
  private readonly storyApiService = inject(StoryApiService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly scrumPokerService = inject(ScrumPokerService);

  currentUser: User | null = null;
  room: Room | null = null;
  teams: Team[] = [];
  storys: Story[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roomId = idParam ? +idParam : 0;
    this.socketConnectedSubscription = this.scrumPokerService.isSocketConnected$.subscribe(isConnected => {
      this.socketConnected = isConnected;
      if (isConnected) {
        this.scrumPokerService.joinRoom(this.roomId);
        this.loadTeams();
        this.loadRoomObject();
        this.loadCurrentUser();
        this.setupSocketListeners();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.scrumPokerService.leaveRoom(this.roomId);
    this.scrumPokerService.disconnect();
  }

  ngOnDestroy(): void {
    this.scrumPokerService.leaveRoom(this.roomId);
    this.scrumPokerService.disconnect();
  }

  getCurrentUserVoted(userId: number): boolean {
    return this.storySelected?.estimations?.some(estimation => estimation.user.id === userId) ?? false;
  }

  selectStory(value: Story | null): void {
    if (!value || this.storySelected?.id === value.id || !this.socketConnected) return;
    this.scrumPokerService.selectStory(value.id, this.roomId);
  }

  /**
   * This function is a implemention of show dialog form for add one team in room
   */
  addTeam(): void {
    const dialogData: DialogData = {
      title: 'Add team to room',
      content: SelectObjectComponent,
      confirmText: 'Select',
      cancelText: 'Cancel',
      objects: this.teams
    };
    this.openDialog(dialogData, this.saveAddTeam.bind(this));
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

  selectPointCard(value: PokerVoteValue): void {
    if (!this.storySelected?.id || !this.currentUser?.id || !this.socketConnected) return;

    this.scrumPokerService.vote(this.storySelected.id, value, this.roomId);
  }

  revelPoint(): void {
    if (this.socketConnected) {
      this.scrumPokerService.revealResults(this.storySelected?.id ?? 0, this.roomId);
    }
  }

  private loadRoomObject(): void {
    this.roomApiService.getRoomByIdAndValidateAccess(this.roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.storys = room.stories || [];
        this.teams = room.teams || [];
        this.storySelected = this.storys.find(e => e.id === this.storySelected?.id) || null;
        this.cdr.detectChanges();
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

  private saveAddTeam(result: any): void {
    this.roomApiService.addTeamToRoom(this.roomId, result.id).subscribe({
      next: () => {
        this.loadRoomObject();
        this.toastService.success('Team has been successfully added');
      },
      error: () => {
        this.toastService.error('There was an error adding the team');
      }
    });
  }

  private saveStory(result: any): void {
    const newStory: CreateStory = {
      title: result.name,
      description: result.description,
      roomId: this.roomId
    };

    this.scrumPokerService.createStory(newStory);
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

  private setupSocketListeners(): void {
    this.scrumPokerService.onStoryCreated().subscribe((story) => {
      this.storys.push(story);
      this.toastService.success('new story added');
      this.cdr.detectChanges();
    });

    this.scrumPokerService.onVoteUpdated().subscribe((vote) => {
      this.loadRoomObject();
      this.cdr.detectChanges();
    });

    this.scrumPokerService.onResultsRevealed(this.roomId).subscribe((results) => {
      this.loadRoomObject();
      this.cdr.detectChanges();
    });

    this.scrumPokerService.onStorySelected(this.roomId).subscribe((message) => {
      this.storySelected = this.storys.find(s => s.id == message.storyId) || null;
      this.cdr.detectChanges();
    });

    this.scrumPokerService.onRoomMessage().subscribe((message) => {
      this.loadRoomObject();
      this.cdr.detectChanges();
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
}