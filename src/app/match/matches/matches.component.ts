import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Match } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
    @Input() match: Match;
    @Input() currentUser: User;
    @Input() otherUser: User;

    //@Output() likeEvent = new EventEmitter<User>();
    //@Output() dislikeEvent = new EventEmitter<User>();

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.get('user', this.match.user1_id == this.currentUser.id ? this.match.user2_id : this.match.user1_id).then((response: any) => {
            if (response.status === 'success') {
                this.otherUser = response.results[0] as User;
            }
        });
    }
}
