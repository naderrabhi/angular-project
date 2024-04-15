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
            nodeText: 'Dashboard',
            iconCss: 'icon-microchip icon',
            path: 'dashboard',
            nodeChild: [
              {
                nodeId: '01-01',
                nodeText: 'All Users',
                iconCss: 'icon-microchip icon',
                path: 'all-users',
              },
            ],
          },
          {
            nodeId: '02',
            nodeText: 'Logout',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/all-users']);
        break;
      case 'USER':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Peripheral',
            iconCss: 'icon-microchip icon',
            path: 'peripheral',
          },
          {
            nodeId: '02',
            nodeText: 'Logout',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/peripheral']);
        break;
      case 'TECHNICIAN':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Technicians',
            iconCss: 'icon-microchip icon',
            path: 'technicians',
          },
          {
            nodeId: '02',
            nodeText: 'Logout',
            iconCss: 'e-icons logout',
            path: '',
          }
        );
        this.router.navigate(['/technicians']);
        break;
      case 'RESPONSABLE':
        this.data.push(
          {
            nodeId: '01',
            nodeText: 'Assignment Technicians',
            iconCss: 'icon-microchip icon',
            path: 'responsable',
          },
          {
            nodeId: '02',
            nodeText: 'Logout',
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
