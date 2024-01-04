import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { User } from 'src/classes';

@Component({
    selector: 'app-user-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent {
    @Input() user: User;
    @Input() isDummy: boolean;

    @Output() likeEvent = new EventEmitter<User>();
    @Output() dislikeEvent = new EventEmitter<User>();

    private htmlElement: HTMLElement;

    constructor(elem: ElementRef) {
        this.htmlElement = elem.nativeElement;
    }

    like() {
        this.likeEvent.emit(this.user);
        this.htmlElement.classList.add("like");
    }

    dislike() {
        this.dislikeEvent.emit(this.user);
        this.htmlElement.classList.add("dislike");
    }

    info() {
        
    }
}
