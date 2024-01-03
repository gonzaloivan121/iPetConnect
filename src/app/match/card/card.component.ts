import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/classes';

@Component({
    selector: 'app-user-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent {
    @Input() user: User;

    @Output() likeEvent = new EventEmitter<User>();
    @Output() dislikeEvent = new EventEmitter<User>();

    constructor() { }

    like() {
        this.likeEvent.emit(this.user);
    }

    dislike() {
        this.dislikeEvent.emit(this.user);
    }

    info() {
        
    }
}
