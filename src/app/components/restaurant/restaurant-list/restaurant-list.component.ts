import {Component, OnInit} from '@angular/core';
import {RestaurantService} from "../../../services/restaurant.service";
import {Restaurant} from "../../../model/restaurant";
import { categoriesArray } from "../../../model/categories";
import {UserDetailsService} from "../../../services/user-details.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss'
})
export class RestaurantListComponent implements OnInit {
  currentUser = this.userDetailsService.getCurrentUser();
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchTerm: string = '';
  categories: string[] = categoriesArray;
  selectedCategory: string = '';

  constructor(private restaurantService: RestaurantService, private userDetailsService: UserDetailsService, private router: Router) {
    if (this.currentUser?.userType === 'restaurant') {
      this.restaurantService.getRestaurantByOwnerId(this.currentUser!.userId)
        .then(restaurant => {
          if (!restaurant) {
            this.router.navigate(['/restaurant/add'])
          }
        })
    }
  }

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.restaurantService.getAllRestaurants().then(restaurants => {
      this.restaurants = restaurants;
      this.filteredRestaurants = restaurants;
    });
  }

  sortByRating() {
    this.filteredRestaurants.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });
  }

  filterRestaurants() {
    let tempRestaurants = this.restaurants;

    if (this.searchTerm) {
      tempRestaurants = tempRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      tempRestaurants = tempRestaurants.filter(restaurant =>
        restaurant.category === this.selectedCategory
      );
    }

    this.filteredRestaurants = tempRestaurants;
  }

}
