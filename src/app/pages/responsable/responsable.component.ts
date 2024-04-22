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
import { TechnicianAssignment } from '../../models/technician-assignment';
import { UsersService } from '../../services/users/users.service';
import { Users } from '../../models/users';
import { OrdresDeTravailService } from '../../services/ordres-de-travail/ordres-de-travail.service';
import { OrdresDeTravail } from '../../models/ordres-de-travail';
import { AffectationDesOrdres } from '../../models/affectation-des-ordres';
import { AffectationDesOrdresService } from '../../services/affectation-des-ordres/affectation-des-ordres.service';

@Component({
  selector: 'app-responsable',
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
  ],
  templateUrl: './responsable.component.html',
  styleUrl: './responsable.component.css',
  providers: [
    AffectationDesOrdresService,
    OrdresDeTravailService,
    PeripheralService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    UsersService,
  ],
})
export class ResponsableComponent {
  @ViewChild('status') status!: DropDownListComponent;
  @ViewChild('users') users!: DropDownListComponent;
  @ViewChild('Dialog') public Dialog!: DialogComponent;
  @ViewChild('grid') grid!: GridComponent;

  public ordresDeTravailData!: OrdresDeTravail[];
  public technicienData!: Users[];

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
  public technicienSelectedItem!: any;
  public peripheralForUpdate!: any;
  public dialogObj: any;
  public ordresDeTravailId!: number;
  public showChild: boolean = false;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public showCloseIcon: Boolean = true;
  public target: string = '.control-section';
  public Dialogwidth: string = '700px';
  public showUsersColumn: boolean = false;

  public technicienFields: Object = { text: 'nom', value: 'id' };

  constructor(
    private peripheralService: PeripheralService,
    private usersService: UsersService,
    private ordresDeTravailService: OrdresDeTravailService,
    private affectationDesOrdresService: AffectationDesOrdresService
  ) {}

  public ngOnInit(): void {
    this.usersService.getUsers().subscribe((data: any) => {
      console.log(data);
      this.technicienData = data.user.filter(
        (user: any) => user.role == 'TECHNICIEN' && user.isAvailable
      );
    });

    this.ordresDeTravailService
      .getOrdresDeTravail()
      .subscribe((response: any) => {
        this.ordresDeTravailData = response.data;
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

  createAffectationDesOrdres(
    affectationDesOrdres: AffectationDesOrdres,
    args: any
  ) {
    affectationDesOrdres.ordre_travail_id = `${args.data.id}`;
    affectationDesOrdres.technicien_id = `${this.technicienSelectedItem}`;
    affectationDesOrdres.date_resolution = 'null';

    return affectationDesOrdres;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let affectationDesOrdres: AffectationDesOrdres =
        new AffectationDesOrdres();
      affectationDesOrdres = this.createAffectationDesOrdres(
        affectationDesOrdres,
        args
      );
      this.affectationDesOrdresService
        .createAffectationDeOrdre(affectationDesOrdres)
        .subscribe((resultat) => {
          let existedAssignedTechnicien = this.technicienData.filter(
            (user) => user.id == this.technicienSelectedItem
          )[0];
          existedAssignedTechnicien.isAvailable = false;

          this.usersService
            .updateUser(existedAssignedTechnicien)
            .subscribe((data) => {});

          this.ordresDeTravailService
            .getOrdreDeTravailById(args.data.id)
            .subscribe(
              (ordresDeTravail: any) => {
                if (ordresDeTravail) {
                  // Check if peripheral exists before updating
                  ordresDeTravail.data.statut = 'En attente';
                  this.ordresDeTravailService
                    .updateOrdreDeTravail(ordresDeTravail.data)
                    .subscribe(
                      (updatedOrdresDeTravail) => {
                        this.ngOnInit();
                      },
                      (error) => {
                        console.error(
                          'Error updating Ordres de travail:',
                          error
                        );
                      }
                    );
                } else {
                  console.error(
                    'Ordres de travail non trouvée:',
                    this.ordresDeTravailId
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
          column.headerText !== 'Technicien'
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
      this.ordresDeTravailData = this.ordresDeTravailData.filter(
        (item) => item.id !== id
      );
      this.ngOnInit();
    });
  }

  public BtnClick = (id: number): void => {
    this.ordresDeTravailId = id;
    this.showChild = true;
    this.Dialog.show();
  };

  public onDialogClose() {
    this.showChild = false;
    this.Dialog.hide();
  }
}
