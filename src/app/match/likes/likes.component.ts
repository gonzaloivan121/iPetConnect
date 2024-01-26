import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBTables } from 'src/classes';
import { DataService } from 'src/app/services';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ILike, IUser } from 'src/app/interfaces';

@Component({
    selector: "app-likes",
    templateUrl: "./likes.component.html",
    styleUrls: ["./likes.component.css"],
})
export class LikesComponent implements OnInit {
    @Input() like: ILike;
    @Input() user: IUser;
    @Input() isGiven: boolean;

    otherUser: IUser;

    public otherUserLoaded: Observable<boolean>;

    @Output() viewProfileEvent = new EventEmitter<IUser>();
    @Output() deleteLikeEvent = new EventEmitter<{ like: ILike, user: IUser }>();

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.otherUserLoaded = this.getOtherUser();
    }

    getOtherUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(
                    DBTables.User,
                    this.like.user1_id == this.user.id
                        ? this.like.user2_id
                        : this.like.user1_id
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

    deleteLike(user: IUser) {
        this.deleteLikeEvent.emit({like: this.like, user: user});
    }
}
