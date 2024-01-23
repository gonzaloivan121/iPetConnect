import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { DBTables, User } from 'src/classes';

@Component({
    selector: 'app-user-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() user?: User;
    @Input() currentUser?: User;
    @Input() isDummy: boolean;

    @Output() likeEvent = new EventEmitter<User>();
    @Output() dislikeEvent = new EventEmitter<User>();
    @Output() closeEvent = new EventEmitter<User>();

    public isMatch: boolean;

    private htmlElement: HTMLElement;

    constructor(
        elem: ElementRef,
        private dataService: DataService
    ) {
        this.htmlElement = elem.nativeElement;
    }

    ngOnInit(): void {
        this.checkMatch();
        this.htmlElement.classList.add("open");

        setTimeout(() => {
            this.htmlElement.classList.remove("open");
        }, 333);
    }

    private checkMatch() {
        if (!this.currentUser || !this.user) {
            return;
        }

        this.dataService
            .getBothFrom(
                DBTables.Match,
                DBTables.User,
                this.currentUser.id,
                this.user.id
            )
            .then((response: any) => {
                if (response.success) {
                    if (response.result.length > 0) {
                        this.isMatch = true;
                    }
                } else {

                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    like(): void {
        this.likeEvent.emit(this.user);
        this.htmlElement.classList.add("like");
    }

    dislike(): void {
        this.dislikeEvent.emit(this.user);
        this.htmlElement.classList.add("dislike");
    }

    info(): void {
        
    }

    closeProfile(): void {
        this.closeEvent.emit(this.user);
        this.htmlElement.classList.add("closed");
    }
}
