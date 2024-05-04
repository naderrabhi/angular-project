import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  role: string | undefined = 'USER';
  password: string = '';
  errorMessage: string = '';
  rolesList = [
    {
      value: 1,
      text: 'USER',
    },
    {
      value: 2,
      text: 'TECHNICIAN',
    },
    {
      value: 3,
      text: 'RESPONSABLE',
    },
    {
      value: 4,
      text: 'ADMIN',
    },
  ];

  onRoleChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      this.role = this.rolesList.find(
        (item) => item.value == selectedValue
      )?.text;
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  register() {
    this.authService
      .register({
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        role: this.role,
        password: this.password,
        isAvailable: true,
        isAccepted: false,
      })
      .subscribe(
        (data) => {
          this.toastr.success(
            `${this.nom} ${this.prenom} enregistré avec succès`
          );
          this.router.navigate(['/signin']);
        },
        (error) => {
          for (const key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
              this.toastr.warning(error.error.errors[key]);
            }
          }
        }
      );
  }
}
