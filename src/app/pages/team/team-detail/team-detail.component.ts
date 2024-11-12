import { Component, OnInit } from '@angular/core';
import { Team } from '../../../interfaces/API/team.interface';
import { User } from '../../../interfaces/API/user.interface';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamApiService } from '../../../services/API/team-api.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTreeModule, CommonModule],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.sass']
})
export class TeamDetailComponent implements OnInit {
  id: number = 0;
  teamData: Team | null = null;

  private _transformer = (node: TeamNode, level: number): TeamFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      description: node.description,
      details: node.details
    };
  };

  treeControl = new FlatTreeControl<TeamFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener<TeamNode, TeamFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private readonly teamApiService: TeamApiService
  ) { }

  ngOnInit(): void {
    this.initializeTeam();
  }

  private initializeTeam(): void {
    const idParam = this.activeRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id === 0) {
      this.router.navigate(["**"]);
      return;
    }

    this.teamApiService.getTeam(this.id).subscribe({
      next: (team) => {
        this.teamData = team;
        const treeData: TeamNode[] = this.buildTreeData(this.teamData);
        this.dataSource.data = treeData;
      },
      error: (error) => {
        console.error(error);
        this.router.navigate(["**"]);
      }
    });
  }

  hasChild = (_: number, node: TeamFlatNode) => node.expandable;

  private buildTreeData(team: Team): TeamNode[] {
    return [
      {
        name: team.name,
        description: team.description,
        children: [
          {
            name: 'Members',
            children: team.members?.map(member => ({
              name: `${member.name} ${member.lastName}`,
              description: member.email,
              details: { isVerified: member.isVerified, isConnectedWS: member.isConnectedWS }
            }))
          },
          {
            name: 'Created By',
            description: team.user?.email,
            children: [
              { name: `Username: ${team.user?.userName}`, description: `Full Name: ${team.user?.name} ${team.user?.lastName}` },
              { name: `Verified: ${team.user?.isVerified ? 'Yes' : 'No'}`, description: `Connected: ${team.user?.isConnectedWS ? 'Yes' : 'No'}` }
            ]
          }
        ]
      }
    ];
  }
}

// Interfaces para los nodos de árbol
interface TeamFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  description?: string;
  details?: any;
}

interface TeamNode {
  name: string;
  children?: TeamNode[];
  description?: string;
  details?: any;
}
