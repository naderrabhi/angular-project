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
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { Emplacements } from '../../models/emplacements';
import { EmplacementsService } from '../../services/emplacements/emplacements.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-emplacements',
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
    SpinnerComponent,
  ],
  templateUrl: './emplacements.component.html',
  styleUrl: './emplacements.component.css',
  providers: [
    EmplacementsService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
  ],
})
export class EmplacementsComponent {
  @ViewChild('grid') grid!: GridComponent;

  public emplacementsData!: Emplacements[];
  public editSettings!: Object;
  public toolbar!: string[];
  public nomrules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;
  public dialogObj: any;

  public roleData: string[] = ['USER', 'TECHNICIEN', 'RESPONSABLE', 'ADMIN'];
  public roleSelectedItem!: any;
  public userForUpdate!: any;
  loading: boolean = true;
  showSpinner: boolean = true;

  constructor(
    private emplacementsService: EmplacementsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.emplacementsService.getEmplacements().subscribe(
      (data: any) => {
        this.emplacementsData = data.emplacements;
        this.loading = false;
        this.showSpinner = false;
      },
      (error) => {
        console.error('Error fetching emplacements:', error);
        this.loading = false;
        this.showSpinner = false;
      }
    );

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

  createEmplacement(emplacements: Emplacements, args: any) {
    emplacements.nom = args.data.nom;
    emplacements.description = args.data.description;

    return emplacements;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      if (args.data.id) {
        let emplacements: Emplacements = new Emplacements();
        emplacements = this.createEmplacement(emplacements, args);
        emplacements.id = args.data.id;
        this.emplacementsService
          .updateEmplacement(emplacements)
          .subscribe((res) => {
            this.toastr.success(res.message);
            this.ngOnInit();
          });
      } else {
        let emplacements: Emplacements = new Emplacements();
        emplacements = this.createEmplacement(emplacements, args);
        this.emplacementsService
          .createEmplacement(emplacements)
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
        content: `Vous voulez supprimer cette emplacement?`,
        okButton: {
          click: this.deleteEmplacement.bind(this, deletedDataId),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'beginEdit') {
      this.emplacementsService
        .getEmplacementById(args.rowData.id)
        .subscribe((response: any) => {});
    }
  }

  public deleteEmplacement(id: any) {
    this.emplacementsService.deleteEmplacement(id).subscribe((res) => {
      this.toastr.success(res.message);
      this.dialogObj.hide();
      this.emplacementsData = this.emplacementsData.filter(
        (item) => item.id !== id
      );
      this.ngOnInit();
    });
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }
}
