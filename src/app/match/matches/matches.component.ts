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
    @Input() currentUser: User;
    otherUser: User;

    public otherUserLoaded: Observable<boolean>;

    //@Output() likeEvent = new EventEmitter<User>();
    //@Output() dislikeEvent = new EventEmitter<User>();

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.otherUserLoaded = this.getOtherUser();
    }

    getOtherUser(): Observable<boolean> {
        return from(this.dataService.get('user', this.match.user1_id == this.currentUser?.id ? this.match.user2_id : this.match.user1_id).then((response: any) => {
            if (response.status === 'success') {
                this.otherUser = response.results[0] as User;
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    viewProfile(user: User) {
        console.log(user)
    }

    openChat(user: User) {
        console.log(user)
    }

    undoMatch(user: User) {
        console.log(user)
    }

}
