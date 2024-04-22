import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import {
  ToastComponent,
  ToastModule,
} from '@syncfusion/ej2-angular-notifications';

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

  constructor(private authService: AuthService, private router: Router) {}

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

  showToast(message: string, type: string): void {
    let cssClass = '';
    switch (type) {
      case 'error':
        cssClass = 'error-toast';
        break;
      case 'success':
        cssClass = 'success-toast';
        break;
      case 'warning':
        cssClass = 'warning-toast';
        break;
      default:
        cssClass = '';
    }

    this.toast.show({ content: message, cssClass: cssClass });
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
              this.showToast(data.message, 'success');
              this.router.navigate(['/users']);
              break;
            case 'USER':
              this.showToast(data.message, 'success');
              this.router.navigate(['/user']);
              break;
            case 'TECHNICIEN':
              this.showToast(data.message, 'success');
              this.router.navigate(['/technicien']);
              break;
            case 'RESPONSABLE':
              this.showToast(data.message, 'success');
              this.router.navigate(['/responsable']);
              break;
            default:
              this.router.navigate(['/signin']);
          }
          this.errorMessage = '';
        },
        (error) => {
          console.error('Login error:', error.error);
          this.showToast(error.error.message, 'warning');
        }
      );
  }
}
