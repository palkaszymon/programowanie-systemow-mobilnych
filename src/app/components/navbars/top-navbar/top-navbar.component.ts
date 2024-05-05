import {Component, Input} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {
  @Input() title!: string;

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
