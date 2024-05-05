import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './components/auth/registration/user-registration/user-registration.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationTypeComponent } from './components/auth/registration/registration-type/registration-type.component';
import {RestaurantViewComponent} from "./components/restaurant/restaurant-view/restaurant-view.component";
import {AddRestaurantComponent} from "./components/restaurant/add-restaurant/add-restaurant.component";
import {RestaurantListComponent} from "./components/restaurant/restaurant-list/restaurant-list.component";
import {AddReviewComponent} from "./components/restaurant/restaurant-view/add-review/add-review.component";
import {AccountComponent} from "./components/account/account.component";
import {UserDetailsComponent} from "./components/account/user-details/user-details.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'login', component: LoginComponent},
  { path: 'register', component: RegistrationTypeComponent },
  { path: 'register/user', component: UserRegistrationComponent },
  { path: 'restaurant', component: RestaurantViewComponent },
  { path: 'restaurant/add', component: AddRestaurantComponent },
  { path: 'restaurant/list', component: RestaurantListComponent },
  { path: 'restaurant/add-review', component: AddReviewComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/user-details', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
