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
import { UsersService } from '../../services/users/users.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-res-technician-by-user-role',
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
  templateUrl: './res-technician-by-user-role.component.html',
  styleUrl: './res-technician-by-user-role.component.css',
  providers: [
    PeripheralService,
    TechnicianAssignmentService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    UsersService,
  ],
})
export class ResTechnicianByUserRoleComponent {
  @ViewChild('status') status!: DropDownListComponent;
  @ViewChild('users') users!: DropDownListComponent;
  @ViewChild('Dialog') public Dialog!: DialogComponent;
  @ViewChild('grid') grid!: GridComponent;

  public peripheralData!: Peripheral[];
  public usersData!: Users[];

  public technicianAssignedData!: TechnicianAssignment[];
  public editSettings!: Object;
  public toolbar!: string[];
  public namerules!: Object;
  public typerules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;

  public statusData: string[] = ['BROKEN', 'PENDING', 'IN PROGRESS', 'FIXED'];
  public statusSelectedItem!: any;
  public usersSelectedItem!: any;
  public peripheralForUpdate!: any;
  public dialogObj: any;
  public peripheralId!: number;
  public showChild: boolean = false;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public showCloseIcon: Boolean = true;
  public target: string = '.control-section';
  public Dialogwidth: string = '700px';
  public showUsersColumn: boolean = false;

  public usersFields: Object = { text: 'firstName', value: 'id' };

  constructor(
    private peripheralService: PeripheralService,
    private technicianAssignmentService: TechnicianAssignmentService,
    private usersService: UsersService
  ) {}

  public ngOnInit(): void {
    this.usersService.getUsers().subscribe((data: any) => {
      this.usersData = data.user.filter(
        (user: any) => user.role == 'TECHNICIAN' && user.disponible
      );
    });

    this.peripheralService.getPeripherals().subscribe((response: any) => {
      this.peripheralData = response.data;
    });

    this.technicianAssignmentService
      .getTechnicianAssignments()
      .subscribe((data) => {
        this.technicianAssignedData = data;
      });

    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: false,
      mode: 'Dialog',
    };
    this.toolbar = ['Edit'];
    this.namerules = { required: true };
    this.typerules = { required: true };
    this.descriptionrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createAssignment(assignedTechnicien: TechnicianAssignment, args: any) {
    assignedTechnicien.id_peripheral = `${args.data.id}`;
    assignedTechnicien.id_technician = `${this.usersSelectedItem}`;
    assignedTechnicien.confirmed_at = `null`;
    assignedTechnicien.fixed_at = `null`;
    assignedTechnicien.fixed = false;
    assignedTechnicien.confirmed = false;
    // this.users.clear();

    return assignedTechnicien;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let assignedTechnicien: TechnicianAssignment = new TechnicianAssignment();
      assignedTechnicien = this.createAssignment(assignedTechnicien, args);
      this.technicianAssignmentService
        .createTechnicianAssignment(assignedTechnicien)
        .subscribe((resultat) => {
          let existedAssignedTechnicien = this.usersData.filter(
            (user) => user.id == this.usersSelectedItem
          )[0];
          existedAssignedTechnicien.disponible = false;

          this.usersService
            .updateUser(existedAssignedTechnicien)
            .subscribe((data) => {});

          this.peripheralService.getPeripheralById(args.data.id).subscribe(
            (peripheral: any) => {
              if (peripheral) {
                // Check if peripheral exists before updating
                peripheral.data.status = 'PENDING';
                this.peripheralService
                  .updatePeripheral(peripheral.data)
                  .subscribe(
                    (updatedPeripheral) => {
                      console.log(
                        'Peripheral updated successfully:',
                        updatedPeripheral
                      );
                      this.ngOnInit();
                    },
                    (error) => {
                      console.error('Error updating peripheral:', error);
                    }
                  );
              } else {
                console.error(
                  'Peripheral not found with ID:',
                  this.peripheralId
                );
              }
            },
            (error) => {
              console.error('Error fetching peripheral:', error);
            }
          );

          this.ngOnInit();
        });
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

    if (args.requestType === 'beginEdit') {
      for (var i = 0; i < this.grid.columns.length; i++) {
        const column = this.grid.columns[i];
        if (
          column &&
          typeof column !== 'string' &&
          column.headerText !== 'Users'
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
