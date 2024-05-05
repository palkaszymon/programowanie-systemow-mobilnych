import { Component } from '@angular/core';
import {RestaurantService} from "../../../services/restaurant.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Restaurant} from "../../../model/restaurant";
import {UserDetailsService} from "../../../services/user-details.service";
import {forkJoin} from "rxjs";
import {categoriesArray} from "../../../model/categories";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss']
})
export class AddRestaurantComponent {
  restaurantForm: FormGroup;
  logoFile!: File;
  menuPhotoFile!: File;
  restaurantPhotoFiles!: File[];
  categories: string[] = categoriesArray;
  possibleAddresses: string[] = [];
  selectedAddress: string = '';

  constructor(private fb: FormBuilder, private restaurantService: RestaurantService, private userDetailsService: UserDetailsService,
              private router: Router) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      menuPhoto: ['', Validators.required],
      restaurantPhotos: ['', Validators.required]
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat, lng };
        geocoder.geocode({ 'location': latlng }, (results, status) => {
          if (status === 'OK' && results![0]) {
            this.possibleAddresses = results!.map(res => res.formatted_address);
            this.restaurantForm.get('address')!.setValue(results![0].formatted_address);
          } else {
            console.error('Geocoder failed due to: ' + status);
          }
        });
      }, (error) => {
        console.error('Geolocation failed: ' + error.message);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  handleFileInput(event: any, type: 'logo' | 'menu' | 'restaurant') {
    const files = event.target.files;
    if (type === 'restaurant') {
      this.restaurantPhotoFiles = Array.from(files);
    } else if (type ==='menu') {
      this.menuPhotoFile = files[0];
    } else {
      this.logoFile = files[0];
    }
  }

  onSubmit() {
    if (this.restaurantForm.valid) {
      let newRestaurant = {
        name: this.restaurantForm.get('name')!.value,
        ownerId: this.userDetailsService.getCurrentUser()?.userId,
        category: this.restaurantForm.get('category')!.value,
        description: this.restaurantForm.get('description')!.value,
        address: this.restaurantForm.get('address')!.value,
        pictures: [],
        menuPicture: '',
        logo: '',
        rating: 0,
        numberOfRatings: 0
      } as Restaurant;
      const logoFilePath = `restaurants/${newRestaurant.name}/logo/${this.logoFile.name}`;
      const menuFilePath = `restaurants/${newRestaurant.name}/menu/${this.menuPhotoFile.name}`;

      const logoUpload$ = this.restaurantService.uploadFile(this.logoFile, logoFilePath);
      const menuUpload$ = this.restaurantService.uploadFile(this.menuPhotoFile, menuFilePath);
      const photoUploads$ = this.restaurantPhotoFiles.map(file => {
        const filePath = `restaurants/${newRestaurant.name}/photos/${file.name}`;
        return this.restaurantService.uploadFile(file, filePath);
      });

      forkJoin([logoUpload$, menuUpload$, ...photoUploads$]).subscribe(results => {
        newRestaurant.logo = results[0];
        newRestaurant.menuPicture = results[1];
        newRestaurant.pictures = results.slice(2);

        this.restaurantService.saveRestaurant(newRestaurant)
          .then(() => this.router.navigate(['/restaurant/list']))
      });
    }
  }
}
