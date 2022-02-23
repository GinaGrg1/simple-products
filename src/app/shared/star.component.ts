import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

// OnChanges : call the class everytime there is a change..
// @Input() lets data pass from parent to child component. The rating will come from product-list.component.html
// @Output() lets data pass from child to parent. It has to be an event. Hence, EventEmitter
// We will expose the message in the emit()
@Component({
    selector: 'rpm-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
    @Input() rating: number = 0;
    cropWidth: number = 75;
    @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        this.cropWidth = this.rating * 75/5;
    }

    onClick(): void {
        this.ratingClicked.emit(`The rating ${this.rating} was clicked!`)
    }
}