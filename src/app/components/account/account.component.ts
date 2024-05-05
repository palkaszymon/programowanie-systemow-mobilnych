import { Component } from '@angular/core';
import {UserDetailsService} from "../../services/user-details.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  currentUser = this.userDetailsService.getCurrentUser();
  constructor(private userDetailsService: UserDetailsService, private router: Router) {}

  logout() {
    this.userDetailsService.logout().then(() => this.router.navigate(['/']));
  }
}
