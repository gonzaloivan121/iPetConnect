import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUser, IMatch } from 'src/app/interfaces'

@Component({
    selector: "app-matches",
    templateUrl: "./matches.component.html",
    styleUrls: ["./matches.component.css"],
})
export class MatchesComponent implements OnInit {
    @Input() match: IMatch;
    @Input() user: IUser;
    otherUser: IUser;

    public otherUserLoaded: Observable<boolean>;

    @Output() viewProfileEvent = new EventEmitter<IUser>();
    @Output() openChatEvent = new EventEmitter<IUser>();
    @Output() undoMatchEvent = new EventEmitter<IUser>();

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.otherUserLoaded = this.getOtherUser();
    }

    getOtherUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(
                    DBTables.User,
                    this.match.user1_id == this.user.id
                        ? this.match.user2_id
                        : this.match.user1_id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.otherUser = response.result[0] as IUser;
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    viewProfile(user: IUser) {
        this.viewProfileEvent.emit(user);
    }

    openChat(user: IUser) {
        this.openChatEvent.emit(user);
    }

    undoMatch(user: IUser) {
        this.undoMatchEvent.emit(user);
    }
}
