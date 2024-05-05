import { Component, Input } from '@angular/core';
import { Restaurant } from "../../../../model/restaurant";

@Component({
  selector: 'app-restaurant-tile',
  templateUrl: './restaurant-tile.component.html',
  styleUrl: './restaurant-tile.component.scss'
})
export class RestaurantTileComponent {
  @Input() restaurant!: Restaurant;
}
