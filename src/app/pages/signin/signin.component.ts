import { Component, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import {
  ToastComponent,
  ToastModule,
} from '@syncfusion/ej2-angular-notifications';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, RouterModule, ToastModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  @ViewChild('toast') toast!: ToastComponent;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.executeReloadOnce();
  }

  executeReloadOnce() {
    const reloadExecuted = localStorage.getItem('reloadExecuted');
    if (!reloadExecuted) {
      localStorage.setItem('reloadExecuted', 'true');
      window.location.reload();
    }
  }

  private userRoleSubject = new BehaviorSubject<string>('');

  userRole$ = this.userRoleSubject.asObservable();

  login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe(
        (data) => {
          switch (data.user.role) {
            case 'ADMIN':
              this.toastr.success(
                `Bienvenue ${data.user.nom} ${data.user.prenom}`
              );
              this.router.navigate(['/users']);
              break;
            case 'USER':
              this.toastr.success(
                `Bienvenue ${data.user.nom} ${data.user.prenom}`
              );
              this.router.navigate(['/user']);
              break;
            case 'TECHNICIEN':
              this.toastr.success(
                `Bienvenue ${data.user.nom} ${data.user.prenom}`
              );
              this.router.navigate(['/technicien']);
              break;
            case 'RESPONSABLE':
              this.toastr.success(
                `Bienvenue ${data.user.nom} ${data.user.prenom}`
              );
              this.router.navigate(['/responsable']);
              break;
            default:
              this.router.navigate(['/signin']);
          }
          this.errorMessage = '';
        },
        (error) => {
          this.toastr.warning(error.error.message);
        }
      );
  }
}
