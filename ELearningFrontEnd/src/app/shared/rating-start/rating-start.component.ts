import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rating-start',
  templateUrl: './rating-start.component.html',
  styleUrls: ['./rating-start.component.css']
})
export class RatingStartComponent implements OnInit{

    @Input() rating: number = 0;

    ngOnInit(): void {
    }
}
