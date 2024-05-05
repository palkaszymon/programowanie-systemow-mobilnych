import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { UserRegistrationComponent } from './components/auth/registration/user-registration/user-registration.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegistrationTypeComponent } from './components/auth/registration/registration-type/registration-type.component';
import { RestaurantViewComponent } from './components/restaurant/restaurant-view/restaurant-view.component';
import {NgOptimizedImage} from "@angular/common";
import { MapComponent } from './components/restaurant/restaurant-view/map/map.component';
import { ReviewCellComponent } from './components/restaurant/restaurant-view/review-cell/review-cell.component';
import { AddRestaurantComponent } from './components/restaurant/add-restaurant/add-restaurant.component';
import { RestaurantTileComponent } from './components/restaurant/restaurant-list/restaurant-tile/restaurant-tile.component';
import { RestaurantListComponent } from './components/restaurant/restaurant-list/restaurant-list.component';
import { AddReviewComponent } from './components/restaurant/restaurant-view/add-review/add-review.component';
import { BottomNavBarComponent } from './components/navbars/bottom-nav-bar/bottom-nav-bar.component';
import { TopNavbarComponent } from './components/navbars/top-navbar/top-navbar.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { AccountComponent } from './components/account/account.component';
import { UserDetailsComponent } from './components/account/user-details/user-details.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    LandingPageComponent,
    LoginComponent,
    RegistrationTypeComponent,
    RestaurantViewComponent,
    MapComponent,
    ReviewCellComponent,
    AddRestaurantComponent,
    RestaurantTileComponent,
    RestaurantListComponent,
    AddReviewComponent,
    BottomNavBarComponent,
    TopNavbarComponent,
    AccountComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
    GoogleMapsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
