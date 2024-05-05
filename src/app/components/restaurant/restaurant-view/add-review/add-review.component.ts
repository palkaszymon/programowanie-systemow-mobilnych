import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestaurantService} from "../../../../services/restaurant.service";
import {Review} from "../../../../model/review";
import {ActivatedRoute, Router} from "@angular/router";
import {UserDetailsService} from "../../../../services/user-details.service";

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
  reviewPhotoFile: File | null = null;

  constructor(private fb: FormBuilder, private userDetailsService: UserDetailsService,
              private restaurantService: RestaurantService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.restaurantName = params['restaurantName'];
    });

    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      review: ['', Validators.required],
      reviewPhoto: ['']
    });
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    this.reviewPhotoFile = files[0];
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const review: Review = {
        restaurant: this.restaurantName,
        authorId: this.currentUser!.userId,
        authorName: this.currentUser!.fullName,
        rating: this.reviewForm.get('rating')!.value,
        review: this.reviewForm.get('review')!.value,
        reviewPhoto: this.reviewPhotoFile? this.reviewPhotoFile.name : null
      };

      this.restaurantService.submitReview(review).then(reviewId => {
        if (this.reviewPhotoFile) {
          const reviewPhotoPath = `reviews/${reviewId}`;
          this.restaurantService.uploadFile(this.reviewPhotoFile, reviewPhotoPath)
            .subscribe(downloadUrl => this.restaurantService.updateReviewPhotoLink(reviewId, downloadUrl));
        }
        navigator.vibrate([200,50,200])
      }).then(() => this.router.navigate(['/restaurant/list']))
    }
  }
}
