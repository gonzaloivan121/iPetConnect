import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { IUser, ILike } from 'src/app/interfaces';

@Component({
    selector: "app-user-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
    @Input() user?: IUser;
    @Input() currentUser?: IUser;
    @Input() isDummy: boolean;
    @Input() isMatch: boolean;
    @Input() isLike: boolean;

    @Output() likeEvent = new EventEmitter<IUser>();
    @Output() dislikeEvent = new EventEmitter<IUser>();
    @Output() closeEvent = new EventEmitter<IUser>();

    private htmlElement: HTMLElement;

    constructor(elem: ElementRef, private dataService: DataService) {
        this.htmlElement = elem.nativeElement;
    }

    ngOnInit(): void {
        this.htmlElement.classList.add("open");

        setTimeout(() => {
            this.htmlElement.classList.remove("open");
        }, 333);
    }

    like(): void {
        this.likeEvent.emit(this.user);
        this.htmlElement.classList.add("like");
    }

    dislike(): void {
        this.dislikeEvent.emit(this.user);
        this.htmlElement.classList.add("dislike");
    }

    info(): void {}

    closeProfile(): void {
        this.closeEvent.emit(this.user);
        this.htmlElement.classList.add("closed");
    }
}
