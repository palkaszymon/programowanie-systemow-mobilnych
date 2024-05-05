import {Component, Input} from '@angular/core';
import {Review} from "../../../../model/review";

@Component({
  selector: 'app-review-cell',
  templateUrl: './review-cell.component.html',
  styleUrl: './review-cell.component.scss'
})
export class ReviewCellComponent {
  @Input() review!: Review;
  @Input() cellType!: 'restaurantView' | 'userView'
}
