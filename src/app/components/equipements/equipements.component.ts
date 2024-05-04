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
  ColorPickerModule,
  NumericTextBoxAllModule,
  RatingAllModule,
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { Equipements } from '../../models/equipements';
import { EquipementsService } from '../../services/equipements/equipements.service';
import { Emplacements } from '../../models/emplacements';
import { EmplacementsService } from '../../services/emplacements/emplacements.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    ColorPickerModule,
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
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.css',
  providers: [
    EmplacementsService,
    EquipementsService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
  ],
})
export class EquipementsComponent {
  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('emplacement') emplacement!: DropDownListComponent;

  public equipementsData!: Equipements[];
  public emplacementsData!: Emplacements[];
  public emplacementSelectedItem!: any;
  public emplacementsFields: Object = { text: 'nom', value: 'id' };
  public emplacementForUpdate!: any;

  public editSettings!: Object;
  public toolbar!: string[];
  public nomrules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;
  public dialogObj: any;

  constructor(
    private equipementsService: EquipementsService,
    private emplacementsService: EmplacementsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.equipementsService.getEquipements().subscribe((data: any) => {
      this.equipementsData = data.data;
    });

    this.emplacementsService.getEmplacements().subscribe((data: any) => {
      this.emplacementsData = data.emplacements;
    });

    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.toolbar = ['Add', 'Edit', 'Delete'];
    this.nomrules = { required: true };
    this.descriptionrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createEmplacement(equipements: Equipements, args: any) {
    equipements.nom = args.data.nom;
    equipements.description = args.data.description;
    equipements.coleur = args.data.coleur;
    equipements.marque = args.data.marque;
    equipements.modele = args.data.modele;
    equipements.numero_serie = args.data.numero_serie;
    equipements.emplacement_id = `${this.emplacementSelectedItem}`;

    this.emplacement.clear();

    return equipements;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      if (args.data.id) {
        let equipements: Equipements = new Equipements();
        equipements = this.createEmplacement(equipements, args);
        equipements.id = args.data.id;
        this.equipementsService
          .updateEquipement(equipements)
          .subscribe((res) => {
            this.toastr.success(res.message);
            this.ngOnInit();
          });
      } else {
        let equipements: Equipements = new Equipements();
        equipements = this.createEmplacement(equipements, args);
        this.equipementsService
          .createEquipement(equipements)
          .subscribe((res) => {
            this.toastr.success(res.message);
            this.ngOnInit();
          });
      }
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: `Supprimer ${args.data[0].nom}`,
        content: `Vous voulez supprimer cette equipement?`,
        okButton: {
          click: this.deleteEquipement.bind(this, deletedDataId),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'beginEdit') {
      this.equipementsService
        .getEquipementById(args.rowData.id)
        .subscribe((response: any) => {
          this.emplacementForUpdate = response.data;
          this.emplacement.value = this.emplacementForUpdate.emplacement.id;
        });
    }
  }

  public deleteEquipement(id: any) {
    this.equipementsService.deleteEquipement(id).subscribe((res) => {
      this.toastr.success(res.message);
      this.dialogObj.hide();
      this.equipementsData = this.equipementsData.filter(
        (item) => item.id !== id
      );
      this.ngOnInit();
    });
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }
}
