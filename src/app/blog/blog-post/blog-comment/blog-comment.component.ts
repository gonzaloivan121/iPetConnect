import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { IBlogComment, IBlogCommentUserLike, IInsertResponse, IUser } from "src/app/interfaces";
import { AlertService, DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
    selector: "app-blog-comment",
    templateUrl: "./blog-comment.component.html",
    styleUrls: ["./blog-comment.component.css"],
})
export class BlogCommentComponent implements OnInit {
    @Input() comment: IBlogComment;
    @Input() user?: IUser;

    public commentUser: IUser;
    public commentUserLoaded: Observable<boolean>;

    public likes: IBlogCommentUserLike[] = [];
    public likesLoaded: Observable<boolean>;

    public userLiked: boolean = false;

    constructor(
        private dataService: DataService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.commentUserLoaded = this.loadUser();
        this.likesLoaded = this.loadLikes();
    }

    loadUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, this.comment.user_id)
                .then((response: any) => {
                    if (response.success) {
                        this.commentUser = response.result[0] as IUser;
                    } else {
                        console.warn(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    loadLikes(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(
                    DBTables.BlogCommentUserLike,
                    DBTables.BlogComment,
                    this.comment.id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.likes = response.result as IBlogCommentUserLike[];

                        this.checkIfUserLiked();
                    } else {
                        console.warn(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    checkIfUserLiked() {
        if (this.user === undefined) return;

        this.userLiked =
            this.likes.filter((like) => like.user_id === this.user.id).length >
            0;
    }

    likeComment() {
        if (this.user === undefined) return;

        const like: IBlogCommentUserLike = {
            comment_id: this.comment.id,
            user_id: this.user.id,
        };

        this.dataService
            .insert(DBTables.BlogCommentUserLike, like)
            .then((response: IInsertResponse) => {
                console.log(response);
                if (response.success) {
                    like.id = response.result.insertId;
                    like.created_at = new Date(response.created_at);
                    like.updated_at = new Date(response.created_at);

                    this.likes.push(like);
                    this.userLiked = true;
                } else {
                    console.warn(response);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }

    dislikeComment() {
        if (this.user === undefined) return;

        const like = this.likes.filter(
            (l) =>
                l.comment_id === this.comment.id && l.user_id === this.user.id
        )[0];
        if (like === undefined) return;

        this.dataService
            .delete(DBTables.BlogCommentUserLike, like)
            .then((response: any) => {
                console.log(response);
                if (response.success) {
                    this.likes.splice(this.likes.indexOf(like), 1);
                    this.userLiked = false;
                } else {
                    console.warn(response);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }
}
