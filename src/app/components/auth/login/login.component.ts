import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {UserDetailsService} from "../../../services/user-details.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private userDetailsService: UserDetailsService,
              private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;
      this.authService.login(email, password).then(user => {
        this.userDetailsService.getUserById(user!.user!.uid).then(user => {
          this.userDetailsService.setCurrentUser(user!);
          this.router.navigate(['/restaurant/list']);
        });
      }).catch(error => console.error(error));
    } else {
        alert("Invalid email or password!");
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(user => {
      this.userDetailsService.getUserById(user!.user!.uid).then(user => {
        this.userDetailsService.setCurrentUser(user!);
        this.router.navigate(['/restaurant/list']);
      });
    }).catch(error => console.error(error));
  }
}
