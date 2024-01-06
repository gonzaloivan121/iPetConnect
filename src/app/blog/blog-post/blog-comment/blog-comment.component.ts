import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { IBlogComment } from "src/app/interfaces";
import { DataService } from "src/app/services";
import { DBTables, User } from "src/classes";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
    selector: "app-blog-comment",
    templateUrl: "./blog-comment.component.html",
    styleUrls: ["./blog-comment.component.css"],
})
export class BlogCommentComponent implements OnInit {
    @Input() comment: IBlogComment;
    public user: User;

    public userLoaded: Observable<boolean>;

    @Output() likeCommentEvent = new EventEmitter<IBlogComment>();

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.userLoaded = this.loadUser();
    }

    loadUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, this.comment.user_id)
                .then((response: any) => {
                    if (response.success) {
                        this.user = response.result[0] as User;
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    likeComment() {
        this.likeCommentEvent.emit(this.comment);
    }
}
