import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {UserDetailsService} from "../../../../services/user-details.service";
import {User} from "../../../../model/user";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;
  registrationType!: string;

  constructor(private authService: AuthService, private userDetailsService: UserDetailsService,
              private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fullName: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      this.registrationType = params['type'];
    });
  }

  register() {
    let email = this.registrationForm.get('email')?.value;
    let password = this.registrationForm.get('password')?.value;
    if (this.registrationForm.valid) {
      this.authService.register(email, password).then(user => this.saveUserToDatabase(user!, this.registrationForm.get('fullName')?.value))
        .then(() => this.router.navigate(['/login']))
    } else {
      alert("Provided details are not valid!")
    }
  }

  registerWithGoogle() {
    this.authService.loginWithGoogle().then(user => this.saveUserToDatabase(user!, user!.user!.displayName!))
      .then(() => this.router.navigate(['/login']));
  }

  saveUserToDatabase(user: UserCredential, fullName: string) {
    let newUser: User = {
      userId: user!.user!.uid,
      fullName: fullName,
      userType: this.registrationType
    }
    this.userDetailsService.addUser(newUser);
  }
}
