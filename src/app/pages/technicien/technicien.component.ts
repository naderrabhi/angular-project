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
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { AffectationDesOrdresService } from '../../services/affectation-des-ordres/affectation-des-ordres.service';
import { AffectationDesOrdres } from '../../models/affectation-des-ordres';
import { OrdresDeTravailService } from '../../services/ordres-de-travail/ordres-de-travail.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-technicien',
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
    SpinnerComponent,
  ],
  templateUrl: './technicien.component.html',
  styleUrl: './technicien.component.css',
  providers: [
    OrdresDeTravailService,
    AffectationDesOrdresService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
    AuthService,
  ],
})
export class TechnicienComponent {
  @ViewChild('grid') grid!: GridComponent;

  public affectationDesOrdresData!: AffectationDesOrdres[];
  public existedAssignedTechnicien!: any;

  public editSettings!: Object;
  public toolbar!: string[];
  public namerules!: Object;
  public typerules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;

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
  loading: boolean = true;
  showSpinner: boolean = true;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private affectationDesOrdresService: AffectationDesOrdresService,
    private ordresDeTravailService: OrdresDeTravailService,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getCurrentUserInformation(token).subscribe(
        (userData) => {
          this.technicianId = userData.user.id;
          this.affectationDesOrdresService
            .getAffectationDesOrdresByTechnicianId(this.technicianId)
            .subscribe(
              (data: any) => {
                this.affectationDesOrdresData = data;
                this.loading = false;
                this.showSpinner = false;
              },
              (error) => {
                console.error(
                  'Error fetching les affectation des ordres:',
                  error
                );
                this.loading = false;
                this.showSpinner = false;
              }
            );
        },
        (error) => {
          console.error('Error fetching token:', error);
          this.loading = false;
          this.showSpinner = false;
        }
      );
    }

    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.toolbar = ['Edit', 'Delete'];
    this.namerules = { required: true };
    this.typerules = { required: true };
    this.descriptionrules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  updateAffectationDesOrdres(
    affectationDesOrdres: AffectationDesOrdres,
    args: any
  ) {
    affectationDesOrdres.confirmer = args.data.confirmer;
    affectationDesOrdres.reparer = args.data.reparer;

    let formattedDate = this.getFormattedDate();

    if (!affectationDesOrdres.confirmer && !affectationDesOrdres.reparer) {
      affectationDesOrdres.date_confirmation = 'null';
      affectationDesOrdres.date_resolution = 'null';
    } else if (
      affectationDesOrdres.confirmer &&
      !affectationDesOrdres.reparer
    ) {
      affectationDesOrdres.date_confirmation = formattedDate;
      affectationDesOrdres.date_resolution = 'null';
    } else if (
      !affectationDesOrdres.confirmer &&
      affectationDesOrdres.reparer &&
      !affectationDesOrdres.confirmer
    ) {
      affectationDesOrdres.date_resolution = formattedDate;
      affectationDesOrdres.confirmer = true;
      affectationDesOrdres.date_confirmation = formattedDate;
    } else if (affectationDesOrdres.confirmer && affectationDesOrdres.reparer) {
      affectationDesOrdres.date_resolution = formattedDate;
    }

    return affectationDesOrdres;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      let affectationDesOrdres: AffectationDesOrdres =
        new AffectationDesOrdres();
      affectationDesOrdres.id = args.data.id;
      affectationDesOrdres.ordre_travail_id = `${args.data.ordre_travail_id}`;
      affectationDesOrdres.technicien_id = `${args.data.technicien_id}`;
      affectationDesOrdres = this.updateAffectationDesOrdres(
        affectationDesOrdres,
        args
      );

      this.affectationDesOrdresService
        .updateAffectationDeOrdre(affectationDesOrdres)
        .subscribe((res) => {
          this.toastr.success(res.message);
          this.ordresDeTravailService
            .getOrdreDeTravailById(args.data.ordre_travail_id)
            .subscribe(
              (ordreDeTravail: any) => {
                if (ordreDeTravail) {
                  if (args.data.confirmer && !args.data.reparer) {
                    ordreDeTravail.data.statut = 'En cours';
                    this.usersService
                      .getUserById(args.data.technicien_id)
                      .subscribe((res: any) => {
                        res.message.isAvailable = true;
                        this.usersService
                          .updateUser(res.message)
                          .subscribe((res) => {
                            this.toastr.success(res.message);
                            this.ordresDeTravailService
                              .updateOrdreDeTravail(ordreDeTravail.data)
                              .subscribe(
                                (res) => {
                                  this.toastr.success(res.message);
                                  this.ngOnInit();
                                },
                                (error) => {
                                  console.error(
                                    'Error updating Ordre de travail:',
                                    error
                                  );
                                }
                              );
                          });
                      });
                  } else if (args.data.reparer) {
                    ordreDeTravail.data.statut = 'Réparé';
                    this.usersService
                      .getUserById(args.data.technicien_id)
                      .subscribe((res: any) => {
                        res.message.isAvailable = true;
                        this.usersService
                          .updateUser(res.message)
                          .subscribe((res) => {
                            this.toastr.success(res.message);
                            this.ordresDeTravailService
                              .updateOrdreDeTravail(ordreDeTravail.data)
                              .subscribe(
                                (res) => {
                                  this.toastr.success(res.message);
                                  this.ngOnInit();
                                },
                                (error) => {
                                  console.error(
                                    'Error updating Ordre de travail:',
                                    error
                                  );
                                }
                              );
                          });
                      });
                  } else {
                    ordreDeTravail.data.statut = 'En attente';
                    this.ordresDeTravailService
                      .updateOrdreDeTravail(ordreDeTravail.data)
                      .subscribe(
                        (res) => {
                          this.toastr.success(res.message);
                          this.ngOnInit();
                        },
                        (error) => {
                          console.error(
                            'Error updating Ordre de travail:',
                            error
                          );
                        }
                      );
                  }
                } else {
                  console.error(
                    'Ordre de travail not found with ID:',
                    this.peripheralId
                  );
                }
              },
              (error) => {
                console.error('Error fetching Ordre de travail:', error);
              }
            );
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

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: `Supprimer ${args.data[0].ordreTravail.titre}`,
        content: 'Vous voulez supprimer cette affectation de ordre?',
        okButton: {
          click: this.deleteAffectationDeOrdresDeTravail.bind(
            this,
            deletedDataId
          ),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
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

  getFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }

  public deleteAffectationDeOrdresDeTravail(id: any) {
    this.affectationDesOrdresService
      .deleteAffectationDeOrdre(id)
      .subscribe((res) => {
        this.toastr.success(res.message);
        this.dialogObj.hide();
        this.affectationDesOrdresData = this.affectationDesOrdresData.filter(
          (item) => item.id !== id
        );
        this.ngOnInit();
      });
  }

  getColorByUrgentAndStatut(urgent: any): string {
    switch (urgent) {
      case true:
        return 'red';
      case false:
        return 'black';
      case 'En panne':
        return 'red';
      case 'En attente':
        return 'orange';
      case 'En cours':
        return 'gold';
      case 'Réparé':
        return 'green';
      default:
        return 'black';
    }
  }
}
