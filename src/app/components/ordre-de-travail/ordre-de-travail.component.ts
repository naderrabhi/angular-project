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
import { OrdresDeTravail } from '../../models/ordres-de-travail';
import { AuthService } from '../../services/auth/auth.service';
import { OrdresDeTravailService } from '../../services/ordres-de-travail/ordres-de-travail.service';
import { Equipements } from '../../models/equipements';
import { EquipementsService } from '../../services/equipements/equipements.service';
import { EmplacementsService } from '../../services/emplacements/emplacements.service';
import { Emplacements } from '../../models/emplacements';

@Component({
  selector: 'app-ordre-de-travail',
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
  templateUrl: './ordre-de-travail.component.html',
  styleUrl: './ordre-de-travail.component.css',
  providers: [
    EmplacementsService,
    OrdresDeTravailService,
    EquipementsService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    AuthService,
  ],
})
export class OrdreDeTravailComponent {
  @ViewChild('emplacement') emplacement!: DropDownListComponent;
  @ViewChild('equipement') equipement!: DropDownListComponent;
  @ViewChild('Dialog') public Dialog!: DialogComponent;
  @ViewChild('grid') grid!: GridComponent;

  public ordresDeTravailData!: OrdresDeTravail[];
  public equipementsData!: Equipements[];
  public emplacementsData!: Emplacements[];

  public editSettings!: Object;
  public toolbar!: string[];
  public pageSettings!: Object;
  public editparams!: Object;

  public titrerules!: Object;
  public descriptionrules!: Object;
  public statutrules!: Object;

  public equipementsFields: Object = { text: 'nom', value: 'id' };
  public emplacementsFields: Object = { text: 'nom', value: 'id' };
  public equipementSelectedItem!: any;
  public emplacementSelectedItem!: any;

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
    private ordresDeTravailService: OrdresDeTravailService,
    private equipementsService: EquipementsService,
    private authService: AuthService,
    private emplacementsService: EmplacementsService
  ) {}

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      // Optionally fetch user information if applicable
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.userIdReporter = userData.user.id;
          this.ordresDeTravailService
            .getOrdresDeTravailByUserId(this.userIdReporter)
            .subscribe((response: any) => {
              this.ordresDeTravailData = response.data;
            });
        });

      this.emplacementsService.getEmplacements().subscribe((res: any) => {
        this.emplacementsData = res.emplacements;
      });
    }

    this.editSettings = {
      allowEditing: false,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.toolbar = ['Add', 'Delete'];
    this.titrerules = { required: true };
    this.descriptionrules = { required: true };
    this.statutrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createOrdresDeTravail(ordresDeTravail: OrdresDeTravail, args: any) {
    ordresDeTravail.titre = args.data.titre;
    ordresDeTravail.description = args.data.description;
    ordresDeTravail.statut = 'En panne';
    ordresDeTravail.utilisateur_id = `${this.userIdReporter}`;
    ordresDeTravail.equipement_id = `${this.equipementSelectedItem}`;

    this.equipement.clear();
    this.emplacement.clear();

    return ordresDeTravail;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let ordresDeTravail: OrdresDeTravail = new OrdresDeTravail();
      ordresDeTravail = this.createOrdresDeTravail(ordresDeTravail, args);
      // ordresDeTravail.id = args.data.id;
      this.ordresDeTravailService
        .createOrdreDeTravail(ordresDeTravail)
        .subscribe((resultat) => {
          this.ngOnInit();
        });
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: `Supprimer ${args.data[0].titre}`,
        content: 'Vous voulez supprimer cette ordre de travail?',
        okButton: {
          click: this.deleteOrdreDeTravail.bind(this, deletedDataId),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'cancel') {
      this.equipement.clear();
      this.emplacement.clear();
    }

    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      for (var i = 0; i < this.grid.columns.length; i++) {
        const column = this.grid.columns[i];
        if (
          (column &&
            typeof column !== 'string' &&
            column.headerText === 'Urgent?') ||
          (column &&
            typeof column !== 'string' &&
            column.headerText === 'Statut')
        ) {
          column.visible = false;
        }
      }
    }
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }

  public deleteOrdreDeTravail(id: any) {
    this.ordresDeTravailService.deleteOrdreDeTravail(id).subscribe((res) => {
      this.dialogObj.hide();
      this.ordresDeTravailData = this.ordresDeTravailData.filter(
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

  onEmplacementChange(event: any) {
    this.equipementsService
      .getEquipementsByEmpalcementId(event.itemData.id)
      .subscribe((res: any) => {
        this.equipementsData = res.data;
      });
  }
}
