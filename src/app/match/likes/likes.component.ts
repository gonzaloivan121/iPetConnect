import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Like } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {
    @Input() like: Like;
    @Input() user: User;
    otherUser: User;

    public otherUserLoaded: Observable<boolean>;

    //@Output() likeEvent = new EventEmitter<User>();
    //@Output() dislikeEvent = new EventEmitter<User>();

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.otherUserLoaded = this.getOtherUser();
    }

    getOtherUser(): Observable<boolean> {
        return from(this.dataService.get('user', this.like.user1_id == this.user.id ? this.like.user2_id : this.like.user1_id).then((response: any) => {
            if (response.success) {
                this.otherUser = response.result[0] as User;
            }
        })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    viewProfile(user: User) {
        console.log("viewProfile", user);
    }
}
