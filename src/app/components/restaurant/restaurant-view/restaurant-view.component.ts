import { Component, OnInit } from '@angular/core';
import {Restaurant} from "../../../model/restaurant";
import {Review} from "../../../model/review";
import {RestaurantService} from "../../../services/restaurant.service";
import {UserDetailsService} from "../../../services/user-details.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../model/user";

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.scss']
})
export class RestaurantViewComponent implements OnInit {
  restaurantName!: string;
  restaurant: Restaurant = {
    name: '',
    ownerId: '',
    category: '',
    description: '',
    address: '',
    pictures: [],
    menuPicture: '',
    logo: '',
    rating: 0,
    numberOfRatings: 0
  } as Restaurant;
  restaurantReviews: Review[] = []
  averageRating: number = 0;
  currentUser: User | null = this.userDetailsService.getCurrentUser();
  activeView: string = 'photos';


  constructor(private restaurantService: RestaurantService, private userDetailsService: UserDetailsService,
              private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.restaurantName = params['name'];
    });

    this.fetchRestaurant()
    this.restaurantService.getReviewsForRestaurant(this.restaurantName).then(reviews => {
      this.restaurantReviews = reviews!;
      this.calculateAverageRating()
    });
  }

  ngOnInit(): void {
  }

  setActiveView(view: string) {
    this.activeView = view;
  }

  calculateAverageRating(): void {
    let sum = 0;
    for (let review of this.restaurantReviews) {
      sum += review.rating;
    }
    this.averageRating = sum / this.restaurantReviews.length;
  }

  private fetchRestaurant() {
    this.restaurantService.getRestaurantByName(this.restaurantName).then(restaurant => {
      restaurant? this.restaurant = restaurant : alert("Restaurant does not exist!");
    });
  }

  goToAddReview() {
    this.router.navigate(['restaurant/add-review'], { queryParams: {restaurantName: this.restaurant.name, authorId: this.currentUser?.userId} });
  }
}
