import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomApiService } from '../../../services/API/room-api.service';
import { Room } from '../../../interfaces/API/room.interface';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTreeModule],
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.sass']
})
export class RoomDetailComponent implements OnInit {
  id: number = 0;
  room: Room | null = null;

  // Ajustar la función _transformer y su tipo de retorno
  private _transformer = (node: RoomNode, level: number): RoomFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      description: node.description,
      details: node.details
    };
  };

  treeControl = new FlatTreeControl<RoomFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener<RoomNode, RoomFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private readonly roomApiService: RoomApiService
  ) { }

  ngOnInit(): void {
    this.initializeRoom();
  }

  private initializeRoom(): void {
    const idParam = this.activeRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id === 0) {
      this.router.navigate(["**"]);
      return;
    }

    this.roomApiService.getRoom(this.id).subscribe({
      next: (room) => {
        this.room = room;
        console.info(room);
        const treeData: RoomNode[] = this.buildTreeData(this.room);
        this.dataSource.data = treeData;
      },
      error: (error) => {
        console.error(error);
        this.router.navigate(["**"]);
      }
    });
  }

  hasChild = (_: number, node: RoomFlatNode) => node.expandable;

  private buildTreeData(room: Room): RoomNode[] {
    return [
      {
        name: room.name,
        description: room.description,
        children: [
          {
            name: 'Stories',
            children: room.stories?.map(story => ({
              name: story.title,
              description: story.description,
              details: { estimatedPoint: story.estimatedPoint, isOpen: story.isOpen }
            }))
          },
          {
            name: 'Teams',
            children: room.teams?.map(team => ({
              name: team.name,
              description: team.description,
              children: team.members?.map(member => ({
                name: `${member.name} ${member.lastName}`
              }))
            }))
          },
          {
            name: 'User',
            description: room.user?.email,
            children: [
              { name: `Username: ${room.user?.userName}`, description: `Full Name: ${room.user?.name} ${room.user?.lastName}` },
              { name: `Verified: ${room.user?.isVerified ? 'Yes' : 'No'}`, description: `Connected: ${room.user?.isConnectedWS ? 'Yes' : 'No'}` }
            ]
          }
        ]
      }
    ];
  }
}

interface RoomFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  description?: string;
  details?: any;
}

interface RoomNode {
  name: string;
  children?: RoomNode[];
  description?: string;
  details?: any;
}