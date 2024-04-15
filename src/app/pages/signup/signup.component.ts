import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  firstName: string = '';
  lastName: string = '';
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
  ];

  onRoleChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      this.role = this.rolesList.find(
        (item) => item.value == selectedValue
      )?.text;
    }
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  register() {
    this.authService
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
        password: this.password,
      })
      .subscribe(
        (data) => {
          this.router.navigate(['/signin']);
        },
        (error) => {
          this.errorMessage = 'User already existed.';
          console.error('Register error:', error);
        }
      );
  }
}
