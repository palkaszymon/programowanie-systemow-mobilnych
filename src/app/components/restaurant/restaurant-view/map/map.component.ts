import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Restaurant} from "../../../../model/restaurant";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() restaurant!: Restaurant;
  mapWidth: string = '100%';
  mapHeight: string = '60%';
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    controlSize: 30
  };
  markerOptions!: google.maps.MarkerOptions;
  markerLabel!: string;

  constructor() {
    this.updateMapDimensions();
  }

  ngOnInit(): void {
    if (this.restaurant.address) {
      this.geocodeAddress(this.restaurant.address);
    }
  }

  geocodeAddress(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.center = {
          lat: results![0].geometry.location.lat(),
          lng: results![0].geometry.location.lng()
        };
        this.markerLabel = this.restaurant.name;
        this.markerOptions = {
          position: this.center,
          label: {
            text: this.restaurant.name + "\n" + this.restaurant.address,
            color: "#C70E20",
            fontSize: "12px",
            fontWeight: "bold"
          }
        };
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMapDimensions();
  }

  private updateMapDimensions() {
    if (window.innerWidth < 768) {
      this.mapHeight = '300px';
    } else {
      this.mapHeight = '400px';
    }
  }
}
