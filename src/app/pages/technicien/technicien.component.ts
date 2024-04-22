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
} from '@syncfusion/ej2-angular-popups';
import { TechnicianAssignment } from '../../models/technician-assignment';
import { PeripheralService } from '../../services/peripheral/peripheral.service';
import { Peripheral } from '../../models/peripheral';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { AffectationDesOrdresService } from '../../services/affectation-des-ordres/affectation-des-ordres.service';
import { AffectationDesOrdres } from '../../models/affectation-des-ordres';
import { OrdresDeTravailService } from '../../services/ordres-de-travail/ordres-de-travail.service';

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
  ],
  templateUrl: './technicien.component.html',
  styleUrl: './technicien.component.css',
  providers: [
    OrdresDeTravailService,
    AffectationDesOrdresService,
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
export class TechnicienComponent {
  @ViewChild('grid') grid!: GridComponent;

  public affectationDesOrdresData!: TechnicianAssignment[];
  public peripheralData!: Peripheral[];
  public existedAssignedTechnicien!: any;

  public editSettings!: Object;
  public toolbar!: string[];
  public namerules!: Object;
  public typerules!: Object;
  public descriptionrules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;

  // public statusData: string[] = ['BROKEN', 'PENDING', 'IN PROGRESS', 'FIXED'];
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
    private usersService: UsersService,
    private authService: AuthService,
    private affectationDesOrdresService: AffectationDesOrdresService,
    private ordresDeTravailService: OrdresDeTravailService
  ) {}

  public ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      // Optionally fetch user information if applicable
      this.authService
        .getCurrentUserInformation(token)
        .subscribe((userData) => {
          this.technicianId = userData.user.id;
          this.affectationDesOrdresService
            .getAffectationDesOrdresByTechnicianId(this.technicianId)
            .subscribe((data: any) => {
              this.affectationDesOrdresData = data;
            });
        });
    }

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

  updateAffectationDesOrdres(
    affectationDesOrdres: AffectationDesOrdres,
    args: any
  ) {
    affectationDesOrdres.confirmer = args.data.confirmer;
    affectationDesOrdres.reparer = args.data.reparer;

    let formattedDate = this.getFormattedDate();
    if (affectationDesOrdres.confirmer && !affectationDesOrdres.reparer) {
      affectationDesOrdres.date_confirmation = formattedDate;
      affectationDesOrdres.date_resolution = 'null';
    } else if (
      affectationDesOrdres.reparer &&
      !affectationDesOrdres.confirmer
    ) {
      affectationDesOrdres.date_confirmation = formattedDate;
      affectationDesOrdres.date_resolution = formattedDate;
      affectationDesOrdres.confirmer = true;
    } else if (
      !affectationDesOrdres.reparer &&
      !affectationDesOrdres.confirmer
    ) {
      affectationDesOrdres.date_confirmation = 'null';
      affectationDesOrdres.date_resolution = 'null';
    } else {
      affectationDesOrdres.date_confirmation = formattedDate;
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
        .subscribe((resultat) => {
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
                            this.ordresDeTravailService
                              .updateOrdreDeTravail(ordreDeTravail.data)
                              .subscribe(
                                (updatedOrdreDeTravail) => {
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
                            this.ordresDeTravailService
                              .updateOrdreDeTravail(ordreDeTravail.data)
                              .subscribe(
                                (updatedOrdreDeTravail) => {
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
                        (updatedOrdreDeTravail) => {
                          console.log(
                            'Ordre de travail modifié avec succès:',
                            updatedOrdreDeTravail
                          );
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
    const milliseconds = String(now.getMilliseconds()).padStart(6, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}
