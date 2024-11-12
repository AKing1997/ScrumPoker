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
import { EstimationVoteApiService } from '../../../services/API/estimation-vote-api.service';
import { EstimationVote } from '../../../interfaces/API/estimation-vote.interface';
import { SortStoriesPipe } from "../../../pipes/sort-stories.pipe";
@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [MatGridListModule, MatListModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, CommonModule, SortStoriesPipe],
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

  currentUser: User | null = null;
  room: Room | null = null;
  teams: Team[] = [];
  teamsList: Team[] = [];
  storys: Story[] = [];
  roomId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly teamApiService: TeamApiService,
    private readonly roomApiService: RoomApiService,
    private readonly userApiService: UserApiService,
    private readonly storyApiService: StoryApiService,
    private readonly estimationVoteApiService: EstimationVoteApiService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
    private readonly scrumPokerService: ScrumPokerService,
  ) {
    this.initializeRoom();
  }


  ngOnInit(): void {
    this.checkSocketConnection();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.leaveAndDisconnectRoom();
  }

  ngOnDestroy(): void {
    this.leaveAndDisconnectRoom();
  }

  getCurrentUserVoted(userId: number): boolean {
    return this.storySelected?.estimations?.some(estimation => estimation.user.id === userId) ?? false;
  }

  selectStory(value: Story | null): void {
    if (!value || this.storySelected?.id === value.id || !this.socketConnected) return;
    this.scrumPokerService.selectStory(value.id, this.roomId);
  }

  addTeam(): void {
    const dialogData: DialogData = {
      title: 'Add team to room',
      content: SelectObjectComponent,
      confirmText: 'Select',
      cancelText: 'Cancel',
      objects: this.teamsList
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
    const vote: EstimationVote = {
      storyId: this.storySelected.id,
      userId: this.currentUser?.id,
      voteValue: value
    };

    this.estimationVoteApiService.createEstimationVote(vote).subscribe({
      next: () => {
        this.loadRoomObject();
        this.scrumPokerService.vote(vote.storyId, value, this.roomId);
        //this.toastService.success('Your vote has been successfully submitted');
      },
      error: (error) => {
        console.error('Error submitting vote:', error);
        this.toastService.error('There was an error submitting your vote. Please try again.');
      }
    });

  }

  revelPoint(): void {
    if (this.socketConnected) {
      this.scrumPokerService.revealResults(this.storySelected?.id ?? 0, this.roomId);
    }
  }

  private initializeRoom(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roomId = idParam ? +idParam : 0;

    this.socketConnectedSubscription = this.scrumPokerService.isSocketConnected$.subscribe(isConnected => {
      this.socketConnected = isConnected;
      if (isConnected) {
        this.handleSocketConnection();
      }
    });
  }

  private checkSocketConnection(): void {
    if (!this.socketConnected) {
      this.scrumPokerService.connect();
    }
  }

  private handleSocketConnection(): void {
    this.scrumPokerService.joinRoom(this.roomId);
    this.loadTeams();
    this.loadRoomObject();
    this.loadCurrentUser();
    this.setupSocketListeners();
  }

  private leaveAndDisconnectRoom(): void {
    this.scrumPokerService.leaveRoom(this.roomId);
    this.scrumPokerService.disconnect();
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
    this.teamApiService.getTeams().subscribe({
      next: (data: Team[]) => {
        this.teamsList = data;
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
    this.storyApiService.createStory(newStory).subscribe({
      next: (story) => {
        this.storys.push(story);
        this.cdr.detectChanges();
        this.scrumPokerService.createdStory(newStory);
        this.toastService.success('Historia creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear la historia:', error);
        this.toastService.error('No se pudo crear la historia. Intente de nuevo.');
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