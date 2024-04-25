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
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
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
import { OrdresDeTravailService } from '../../services/ordres-de-travail/ordres-de-travail.service';
import { OrdresDeTravail } from '../../models/ordres-de-travail';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-equipements',
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
  templateUrl: './user-equipements.component.html',
  styleUrl: './user-equipements.component.css',
  providers: [
    AuthService,
    EmplacementsService,
    OrdresDeTravailService,
    EquipementsService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
  ],
})
export class UserEquipementsComponent {
  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('emplacement') emplacement!: DropDownListComponent;
  @ViewChild('priorite') priorite!: DropDownListComponent;

  public equipementsData!: Equipements[];
  public emplacementsData!: Emplacements[];
  public emplacementSelectedItem!: any;
  public emplacementsFields: Object = { text: 'nom', value: 'id' };
  public emplacementForUpdate!: any;
  public prioriteData: string[] = ['Faible', 'Moyenne', 'Haute'];
  public prioriteSelectedItem!: any;
  public isEdit: boolean = false;
  public userIdReporter!: number;

  public editSettings!: Object;
  public toolbar?: ToolbarItems[] | object;
  public nomrules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;
  public dialogObj: any;

  constructor(
    private equipementsService: EquipementsService,
    private emplacementsService: EmplacementsService,
    private ordresDeTravailService: OrdresDeTravailService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.userIdReporter = userData.user.id;
        });
    }

    this.equipementsService.getEquipements().subscribe((data: any) => {
      this.equipementsData = data.data;
    });

    this.emplacementsService.getEmplacements().subscribe((data: any) => {
      this.emplacementsData = data.emplacements;
    });

    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: false,
      mode: 'Dialog',
    };
    this.toolbar = ['Edit'];

    this.nomrules = { required: true };
    this.descriptionrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createOrdresDeTravail(ordresDeTravail: OrdresDeTravail, args: any) {
    ordresDeTravail.titre = args.data.titre;
    ordresDeTravail.description = args.data.descriptionordre;
    // ordresDeTravail.priorite = this.prioriteSelectedItem;
    ordresDeTravail.statut = 'En panne';
    ordresDeTravail.utilisateur_id = `${this.userIdReporter}`;
    ordresDeTravail.equipement_id = `${args.data.id}`;

    // this.priorite.clear();

    return ordresDeTravail;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let ordresDeTravail: OrdresDeTravail = new OrdresDeTravail();
      ordresDeTravail = this.createOrdresDeTravail(ordresDeTravail, args);
      this.ordresDeTravailService
        .createOrdreDeTravail(ordresDeTravail)
        .subscribe((resultat) => {
          this.ngOnInit();
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
}
