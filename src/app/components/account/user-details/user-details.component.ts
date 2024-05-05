import { Component } from '@angular/core';
import {UserDetailsService} from "../../../services/user-details.service";
import { AuthService } from '../../../services/auth.service';
import {RestaurantService} from "../../../services/restaurant.service";
import {Review} from "../../../model/review";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  currentUser = this.userDetailsService.getCurrentUser();
  newPassword: string = '';
  userReviews: Review[] = []

  constructor(private userDetailsService: UserDetailsService, private authService: AuthService, private restaurantService: RestaurantService) {
    this.restaurantService.getReviewsForAuthor(this.currentUser!.userId)
      .then(reviews => {
        this.userReviews = reviews!;
      })
  }

  async changePassword() {
    if (this.newPassword) {
      try {
        await this.authService.updatePassword(this.newPassword);
        alert('Password successfully updated!');
      } catch (error) {
        alert('Failed to update password: ' + error);
      }
    } else {
      alert('Please enter a new password.');
    }
  }
}
