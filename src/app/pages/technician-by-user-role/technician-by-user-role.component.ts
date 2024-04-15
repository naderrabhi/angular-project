import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
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
  TextBoxModule,
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import {
  AnimationSettingsModel,
  DialogModule,
  DialogUtility,
} from '@syncfusion/ej2-angular-popups';
import { TechnicianAssignment } from '../../models/technician-assignment';
import { PeripheralService } from '../../services/peripheral/peripheral.service';
import { TechnicianAssignmentService } from '../../services/technician-assignment/technician-assignment.service';
import { Peripheral } from '../../models/peripheral';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-technicians',
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
    TextBoxModule,
  ],
  templateUrl: './technician-by-user-role.component.html',
  styleUrl: './technician-by-user-role.component.css',
  providers: [
    TechnicianAssignmentService,
    PeripheralService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    AuthService,
  ],
})
export class TechnicianByUserRoleComponent {
  @ViewChild('grid') grid!: GridComponent;

  public technicianAssignedData!: TechnicianAssignment[];
  public peripheralData!: Peripheral[];
  public existedAssignedTechnicien!: any;

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
  public edited: boolean = false;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public showCloseIcon: Boolean = true;
  public target: string = '.control-section';
  public Dialogwidth: string = '700px';
  private technicianId!: number;

  constructor(
    private peripheralService: PeripheralService,
    private technicianAssignmentService: TechnicianAssignmentService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      // Optionally fetch user information if applicable
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.technicianId = userData.user.id;
          this.technicianAssignmentService
            .getAssignmentsByTechnicianId(this.technicianId)
            .subscribe((data: any) => {
              this.technicianAssignedData = data;
            });
        });
    }

    this.technicianAssignmentService
      .getAssignmentsByTechnicianId(this.technicianId)
      .subscribe((data: any) => {
        this.technicianAssignedData = data;
      });

    // this.peripheralService.getPeripherals().subscribe((data) => {
    //   this.peripheralData = data;
    // });

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

  updateAssignment(assignedTechnicien: TechnicianAssignment, args: any) {
    assignedTechnicien.confirmed = args.data.confirmed;
    assignedTechnicien.fixed = args.data.fixed;

    let formattedDate = this.getFormattedDate();
    if (assignedTechnicien.confirmed && !assignedTechnicien.fixed) {
      assignedTechnicien.confirmed_at = formattedDate;
      assignedTechnicien.fixed_at = 'null';
    } else if (assignedTechnicien.fixed && !assignedTechnicien.confirmed) {
      assignedTechnicien.confirmed_at = formattedDate;
      assignedTechnicien.fixed_at = formattedDate;
      assignedTechnicien.confirmed = true;
    } else if (!assignedTechnicien.fixed && !assignedTechnicien.confirmed) {
      assignedTechnicien.confirmed_at = 'null';
      assignedTechnicien.fixed_at = 'null';
    } else {
      assignedTechnicien.confirmed_at = formattedDate;
      assignedTechnicien.fixed_at = formattedDate;
    }

    return assignedTechnicien;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let assignedTechnicien: TechnicianAssignment = new TechnicianAssignment();
      assignedTechnicien = args.data;
      assignedTechnicien = this.updateAssignment(assignedTechnicien, args);
      assignedTechnicien.id = args.data.id;

      this.technicianAssignmentService
        .updateTechnicianAssignment(assignedTechnicien)
        .subscribe((resultat) => {
          this.peripheralService
            .getPeripheralById(args.data.id_peripheral)
            .subscribe(
              (peripheral: any) => {
                if (peripheral) {
                  if (args.data.confirmed && !args.data.fixed) {
                    peripheral.data.status = 'IN PROGRESS';
                  } else if (args.data.fixed) {
                    peripheral.data.status = 'FIXED';
                    this.usersService
                      .getUserById(args.data.id_technician)
                      .subscribe((res: any) => {
                        res.message.disponible = true;
                        this.usersService
                          .updateUser(res.message)
                          .subscribe((res) => {});
                      });
                  } else {
                    peripheral.data.status = 'PENDING';
                  }
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
        });
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: 'Supprimer Assignment Technician',
        content: 'Vous voulez supprimer cette Assignment Techncian?',
        okButton: {
          click: this.deleteTechnicianAssignment.bind(this, deletedDataId),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'beginEdit') {
      for (var i = 0; i < this.grid.columns.length; i++) {
        const column = this.grid.columns[i];
        if (
          column &&
          typeof column !== 'string' &&
          column.headerText !== 'Confirmed?' &&
          column.headerText !== 'Fixed?'
        ) {
          column.visible = false;
        }
      }
    }

    if (args.requestType === 'refresh') {
      for (var i = 0; i < this.grid.columns.length; i++) {
        const column = this.grid.columns[i];
        if (
          column &&
          typeof column !== 'string' &&
          column.headerText !== 'ID'
        ) {
          column.visible = true;
        }
      }
    }
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }

  public deleteTechnicianAssignment(id: any) {
    this.technicianAssignmentService
      .deleteTechnicianAssignment(id)
      .subscribe((res) => {
        this.dialogObj.hide();
        this.technicianAssignedData = this.technicianAssignedData.filter(
          (item) => item.id !== id
        );
        this.ngOnInit();
      });
  }

  getFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(6, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return formattedDate;
  }
}
