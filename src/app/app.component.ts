import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  SidebarModule,
  MenuAllModule,
  TreeViewAllModule,
  ToolbarAllModule,
  SidebarComponent,
} from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';
import {
  RadioButtonModule,
  ButtonModule,
} from '@syncfusion/ej2-angular-buttons';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';

interface NodeData {
  nodeId: string;
  nodeText: string;
  iconCss: string;
  path?: string;
  nodeChild?: NodeData[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    SidebarModule,
    ToolbarAllModule,
    TextBoxAllModule,
    RadioButtonModule,
    MenuAllModule,
    DropDownListModule,
    ButtonModule,
    TreeViewAllModule,
    ListViewAllModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UsersService, AuthService],
})
export class AppComponent {
  title = 'my-project';
  showSidebar = false;

  @ViewChild('sidebarTreeviewInstance')
  public sidebarTreeviewInstance!: SidebarComponent;

  public data: NodeData[] = [];

  ngOnChanges() {
    this.data = [];
    this.showSidebar = false;
    this.ngOnInit();
  }

  ngOnDestroy() {
    this.data = [];
  }

  ngOnInit() {
    this.authService.userRole$.subscribe((userRole) => {
      if (userRole) {
        this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
          this.showSidebar = isLoggedIn;
          if (isLoggedIn) {
            this.getUserInformation(userRole);
          }
        });
      }
    });

    const token = this.authService.getToken();
    if (token) {
      // this.data = [];
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.showSidebar = true;
          // this.data = [];
          this.getUserInformation(userData.user.role);
        });
    } else {
      console.log('Current user information:');
    }
  }

  public width: string = '290px';
  public target: string = '.main-sidebar-content';
  public mediaQuery: string = '(min-width: 600px)';

  public fields: object = {
    dataSource: this.data,
    id: 'nodeId',
    text: 'nodeText',
    child: 'nodeChild',
    iconCss: 'iconCss',
  };

  constructor(private router: Router, private authService: AuthService) {}

  toolbarCliked(): void {
    this.sidebarTreeviewInstance.toggle();
  }

  findNodeById(data: NodeData[], nodeId: string): NodeData | undefined {
    for (const node of data) {
      if (node.nodeId === nodeId && node.nodeId !== '02') {
        return node;
      }
      if (node.nodeChild) {
        const childNode = this.findNodeById(node.nodeChild, nodeId);
        if (childNode) {
          return childNode;
        }
      }
      if (node.nodeId == nodeId) {
        this.data = [];
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.showSidebar = false;
      }
    }
    return undefined;
  }

  async onNodeSelecting(e: any) {
    const selectedNodeId = e.nodeData.id;

    const selectedNode = this.findNodeById(this.data, selectedNodeId);

    if (selectedNode && selectedNode.path) {
      this.router.navigateByUrl(selectedNode.path);
    }
  }

  getUserInformation(role: string) {
    switch (role) {
      case 'ADMIN':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Admin',
            iconCss: 'icon-microchip icon',
            path: 'admin',
            nodeChild: [
              {
                nodeId: '01-01',
                nodeText: 'Users',
                iconCss: 'e-icons logout',
                path: 'users',
              },
              {
                nodeId: '01-02',
                nodeText: 'Emplacements',
                iconCss: 'e-icons logout',
                path: 'emplacements',
              },
              {
                nodeId: '01-03',
                nodeText: 'Equipements',
                iconCss: 'e-icons logout',
                path: 'equipements',
              },
            ],
          },
          {
            nodeId: '02',
            nodeText: 'déconnexion',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/users']);
        break;
      case 'USER':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'User',
            iconCss: 'icon-microchip icon',
            path: 'user',
            nodeChild: [
              {
                nodeId: '01-01',
                nodeText: 'Equipements',
                iconCss: 'e-icons logout',
                path: 'user-equipements',
              },
              {
                nodeId: '01-02',
                nodeText: 'Ordre de travail',
                iconCss: 'e-icons logout',
                path: 'ordre-de-travail',
              },
            ],
          },
          {
            nodeId: '02',
            nodeText: 'déconnexion',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/user']);
        break;
      case 'TECHNICIEN':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Technicien',
            iconCss: 'icon-microchip icon',
            path: 'technicien',
          },
          {
            nodeId: '02',
            nodeText: 'déconnexion',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/technicien']);
        break;
      case 'RESPONSABLE':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Responsable',
            iconCss: 'icon-microchip icon',
            path: 'responsable',
          },
          {
            nodeId: '02',
            nodeText: 'déconnexion',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/responsable']);
        break;
      default:
        this.router.navigate(['/signin']);
    }
  }
}
