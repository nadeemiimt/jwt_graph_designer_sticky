import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: User = {
    username: "",
    name: "",
    password: "",
    roles: [],
    id: ""
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  userRoles = [
    { value: "admin", label: "Admin" },
    { value: "admin-diagram", label: "Admin Diagram" },
    { value: "admin-form", label: "Admin Form" },
    { value: "home" , label: "Home" }
]

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, name, roles, password } = this.form;

    this.authService.register(this.form).subscribe(
      (data: any) => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err: { error: { message: string; }; }) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}