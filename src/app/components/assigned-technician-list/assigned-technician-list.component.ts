import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { TechnicianAssignmentService } from '../../services/technician-assignment/technician-assignment.service';
import { UsersService } from '../../services/users/users.service';
import { Users } from '../../models/users';
import { TechnicianAssignment } from '../../models/technician-assignment';
import { PeripheralService } from '../../services/peripheral/peripheral.service';

@Component({
  selector: 'app-assigned-technicien',
  standalone: true,
  imports: [ComboBoxModule, CheckBoxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assigned-technician-list.component.html',
  styleUrl: './assigned-technician-list.component.css',
  providers: [PeripheralService, UsersService, TechnicianAssignmentService],
})
export class AssignedTechnicianListComponent {
  @Input() peripheralId!: number;
  @Input() showChild!: boolean;
  @Output() buttonClicked = new EventEmitter<any>();

  ngOnChanges() {
    if (this.showChild) {
      this.ngOnInit();
    }
  }

  public usersData!: Users[];
  public technicianSelectedItem: any = null;
  public existedPeripheral!: any;

  constructor(
    private technicianAssignmentService: TechnicianAssignmentService,
    private usersService: UsersService,
    private peripheralService: PeripheralService
  ) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe((data) => {
      this.usersData = data.filter((user) => user.role == 'TECHNICIAN');
    });
  }

  public fields: Object = { text: 'firstName', value: 'id' };
  public height: string = '250px';
  public watermark: string = 'Select an Technician';

  createTechnicianAssigned(assignedTechnicien: TechnicianAssignment) {
    // assignedTechnicien.technician = {
    //   id: this.technicianSelectedItem,
    // };
    // assignedTechnicien.peripheral = {
    //   id: this.peripheralId,
    // };
    assignedTechnicien.id_technician = this.technicianSelectedItem;
    // assignedTechnicien.id_peripheral = this.peripheralId;

    return assignedTechnicien;
  }

  public createOrUpdateAssignedTechnicien() {
    let assignedTechnicien: TechnicianAssignment = new TechnicianAssignment();
    assignedTechnicien = this.createTechnicianAssigned(assignedTechnicien);

    this.technicianAssignmentService
      .createTechnicianAssignment(assignedTechnicien)
      .subscribe((data) => {});

    let existedAssignedTechnicien = this.usersData.filter(
      (user) => user.id == this.technicianSelectedItem
    )[0];
    existedAssignedTechnicien.disponible = false;

    this.usersService
      .updateUser(existedAssignedTechnicien)
      .subscribe((data) => {
        this.ngOnInit();
      });

    this.peripheralService.getPeripheralById(this.peripheralId).subscribe(
      (peripheral) => {
        if (peripheral) {
          // Check if peripheral exists before updating
          peripheral.status = 'PENDING';
          this.peripheralService.updatePeripheral(peripheral).subscribe(
            (updatedPeripheral) => {
              // Handle successful update (optional: display success message, refresh data)
              console.log(
                'Peripheral updated successfully:',
                updatedPeripheral
              );
              this.buttonClicked.emit();
            },
            (error) => {
              console.error('Error updating peripheral:', error);
              // Handle update error (e.g., display error message)
            }
          );
        } else {
          console.error('Peripheral not found with ID:', this.peripheralId);
          // Handle case where peripheral is not found (optional: display error message)
        }
      },
      (error) => {
        console.error('Error fetching peripheral:', error);
        // Handle error fetching peripheral (e.g., display error message)
      }
    );
  }
}
