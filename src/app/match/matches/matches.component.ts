import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Match } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
    @Input() match: Match;
    @Input() user: User;
    otherUser: User;

    public otherUserLoaded: Observable<boolean>;

    @Output() viewProfileEvent = new EventEmitter<User>();
    @Output() openChatEvent = new EventEmitter<User>();
    @Output() undoMatchEvent = new EventEmitter<User>();

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.otherUserLoaded = this.getOtherUser();
    }

    getOtherUser(): Observable<boolean> {
        return from(this.dataService.get('user', this.match.user1_id == this.user.id ? this.match.user2_id : this.match.user1_id).then((response: any) => {
            if (response.success) {
                this.otherUser = response.result[0] as User;
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    viewProfile(user: User) {
        this.viewProfileEvent.emit(user);
    }

    openChat(user: User) {
        this.openChatEvent.emit(user);
    }

    undoMatch(user: User) {
        this.undoMatchEvent.emit(user);
    }

}
