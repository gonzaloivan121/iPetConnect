import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IUser, IPetPostComment, IPetPostCommentUserLike, IInsertResponse } from "src/app/interfaces";

@Component({
    selector: "app-pet-post-comment",
    templateUrl: "./pet-post-comment.component.html",
    styleUrls: ["./pet-post-comment.component.css"],
})
export class PetPostCommentComponent implements OnInit {
    @Input() user: IUser;
    @Input() postUser: IUser;
    @Input() comment: IPetPostComment;
    @Input() isDescription: boolean = false;
    @Input() isAnswer: boolean = false;

    @Output() closePostEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() answerCommentEvent: EventEmitter<void> = new EventEmitter<void>();

    commentUser: IUser;
    commentUserLoaded: Observable<boolean>;

    commentLikes: IPetPostCommentUserLike[] = [];
    commentLikesLoaded: Observable<boolean>;

    showEllipsis: boolean = true;

    isLiked: boolean = false;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.commentUserLoaded = this.getCommentUser();
        this.commentLikesLoaded = this.getCommentLikes();
    }

    getCommentUser(): Observable<boolean> {
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
                .catch((error) => {
                    console.error(error);
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getCommentLikes(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(
                    DBTables.PetPostCommentUserLike,
                    DBTables.PetPostComment,
                    this.comment.id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.commentLikes =
                            response.result as IPetPostCommentUserLike[];
                        this.checkIfCommentIsLiked();
                    } else {
                        console.warn(response.message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    checkIfCommentIsLiked() {
        for (let i = 0; i < this.commentLikes.length; i++) {
            const like = this.commentLikes[i];

            if (like.user_id === this.user.id) {
                this.isLiked = true;
                break;
            }
        }
    }

    likeComment() {
        const data: IPetPostCommentUserLike = {
            comment_id: this.comment.id,
            user_id: this.user.id,
        };

        this.dataService
            .insert(DBTables.PetPostCommentUserLike, data)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    data.id = response.result.insertId;
                    data.created_at = new Date(response.created_at);
                    data.updated_at = new Date(response.created_at);

                    this.commentLikes.push(data);
                    this.isLiked = true;
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    dislikeComment() {
        const like: IPetPostCommentUserLike = this.commentLikes.filter((l) => {
            return (
                l.comment_id === this.comment.id && l.user_id === this.user.id
            );
        })[0];

        this.dataService
            .delete(DBTables.PetPostCommentUserLike, like)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    this.commentLikes.splice(
                        this.commentLikes.indexOf(like),
                        1
                    );
                    this.isLiked = false;
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    isCommentLikedByPostUser(): boolean {
        var result: boolean = false;

        if (this.isDescription) {
            return false;
        }

        for (let i = 0; i < this.commentLikes.length; i++) {
            const like = this.commentLikes[i];

            if (like.user_id === this.postUser.id) {
                result = true;
                break;
            }
        }

        return result;
    }

    answer() {
        this.answerCommentEvent.emit();
    }

    closePost() {
        this.closePostEvent.emit();
    }
}
