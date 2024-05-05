import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestaurantService} from "../../../../services/restaurant.service";
import {Review} from "../../../../model/review";
import {ActivatedRoute} from "@angular/router";
import {UserDetailsService} from "../../../../services/user-details.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.scss'
})
export class AddReviewComponent implements OnInit {
  reviewForm!: FormGroup;
  restaurantName!: string;
  currentUser = this.userDetailsService.getCurrentUser();
  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private fb: FormBuilder, private userDetailsService: UserDetailsService,
              private restaurantService: RestaurantService, private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.restaurantName = params['restaurantName'];
    });

    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      review: ['', Validators.required],
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const review: Review = {
        restaurant: this.restaurantName,
        authorId: this.currentUser!.userId,
        authorName: this.currentUser!.fullName,
        rating: this.reviewForm.get('rating')!.value,
        review: this.reviewForm.get('review')!.value,
      };

      this.restaurantService.submitReview(review).then(() => {
        navigator.vibrate([200,50,200])
      })
      this.location.back();
    }
  }
}
