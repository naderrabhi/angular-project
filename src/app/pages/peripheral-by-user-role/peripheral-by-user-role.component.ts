import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import {
  DropDownListAllModule,
  DropDownListComponent,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  EditService,
  GridAllModule,
  GridComponent,
  PageService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import {
  NumericTextBoxAllModule,
  RatingAllModule,
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import {
  AnimationSettingsModel,
  DialogComponent,
  DialogModule,
  DialogUtility,
} from '@syncfusion/ej2-angular-popups';
import { PeripheralService } from '../../services/peripheral/peripheral.service';
import { Peripheral } from '../../models/peripheral';
import { TechnicianAssignmentService } from '../../services/technician-assignment/technician-assignment.service';
import { TechnicianAssignment } from '../../models/technician-assignment';
import { AssignedTechnicianListComponent } from '../../components/assigned-technician-list/assigned-technician-list.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-peripheral',
  standalone: true,
  imports: [
    FormsModule,
    GridAllModule,
    RouterModule,
    CommonModule,
    ToolbarModule,
    NumericTextBoxAllModule,
    RatingAllModule,
    DialogModule,
    DatePickerAllModule,
    DropDownListAllModule,
    ReactiveFormsModule,
    CheckBoxModule,
    AssignedTechnicianListComponent,
  ],
  templateUrl: './peripheral-by-user-role.component.html',
  styleUrl: './peripheral-by-user-role.component.css',
  providers: [
    PeripheralService,
    TechnicianAssignmentService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    AuthService,
  ],
})
export class PeripheralByUserRoleComponent {
  @ViewChild('status') status!: DropDownListComponent;
  @ViewChild('Dialog') public Dialog!: DialogComponent;
  @ViewChild('grid') grid!: GridComponent;

  public peripheralData!: Peripheral[];
  public technicianAssignedData!: TechnicianAssignment[];
  public editSettings!: Object;
  public toolbar!: string[];
  public namerules!: Object;
  public typerules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;

  public statusData: string[] = ['BROKEN', 'PENDING', 'IN PROGRESS', 'FIXED'];
  // public statusFields: Object = { text: 'libelle' };
  public statusSelectedItem!: any;
  public peripheralForUpdate!: any;
  public dialogObj: any;
  public peripheralId!: number;
  public showChild: boolean = false;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public showCloseIcon: Boolean = true;
  public target: string = '.control-section';
  public Dialogwidth: string = '700px';
  public userIdReporter!: number;

  constructor(
    private peripheralService: PeripheralService,
    private technicianAssignmentService: TechnicianAssignmentService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      // Optionally fetch user information if applicable
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.userIdReporter = userData.user.id;
          this.peripheralService
            .getPeripheralsByUserId(this.userIdReporter)
            .subscribe((response: any) => {
              this.peripheralData = response.data;
            });
        });
    }

    // this.technicianAssignmentService
    //   .getTechnicianAssignments()
    //   .subscribe((data) => {
    //     this.technicianAssignedData = data;
    //   });

    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.toolbar = ['Add', 'Edit', 'Delete'];
    this.namerules = { required: true };
    this.typerules = { required: true };
    this.descriptionrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createPeripheral(peripheral: Peripheral, args: any) {
    peripheral.name = args.data.name;
    peripheral.description = args.data.description;
    peripheral.type = args.data.type;
    peripheral.status = this.statusSelectedItem;

    // peripheral.users = {
    //   id: this.userIdReporter, //id reporter user
    // };
    peripheral.id_reporteduser = `${this.userIdReporter}`;
    this.status.clear();

    return peripheral;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      if (args.data.id) {
        let peripheral: Peripheral = new Peripheral();
        peripheral = this.createPeripheral(peripheral, args);
        peripheral.id = args.data.id;
        this.peripheralService
          .updatePeripheral(peripheral)
          .subscribe((resultat) => {
            this.ngOnInit();
          });
      } else {
        let peripheral: Peripheral = new Peripheral();
        peripheral = this.createPeripheral(peripheral, args);
        this.peripheralService
          .createPeripheral(peripheral)
          .subscribe((resultat) => {
            this.ngOnInit();
          });
      }
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: 'Supprimer Peripheral',
        content: 'Vous voulez supprimer cette Peripheral?',
        okButton: { click: this.deletePeripheral.bind(this, deletedDataId) },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'beginEdit') {
      this.peripheralService
        .getPeripheralById(args.rowData.id)
        .subscribe((response: any) => {
          this.peripheralForUpdate = response.data;
          this.status.value = this.peripheralForUpdate.status;
        });
    }

    if (args.requestType === 'cancel') {
      this.status.clear();
    }

    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      for (var i = 0; i < this.grid.columns.length; i++) {
        const column = this.grid.columns[i];
        if (
          column &&
          typeof column !== 'string' &&
          column.headerText === 'Technicien'
        ) {
          column.visible = false;
        }
      }
    }
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }

  public deletePeripheral(id: any) {
    this.peripheralService.deletePeripheral(id).subscribe((res) => {
      this.dialogObj.hide();
      this.peripheralData = this.peripheralData.filter(
        (item) => item.id !== id
      );
      this.ngOnInit();
    });
  }

  public BtnClick = (id: number): void => {
    this.peripheralId = id;
    this.showChild = true;
    this.Dialog.show();
  };

  public onDialogClose() {
    this.showChild = false;
    this.Dialog.hide();
  }
}
