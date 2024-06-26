import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { AlertService, DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IPetPost, IUser, IPetPostComment, IPetPostUserLike, IInsertResponse } from "src/app/interfaces";
import { NgbCarouselConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-pet-post-profile",
    templateUrl: "./pet-post-profile.component.html",
    styleUrls: ["./pet-post-profile.component.css"],
})
export class PetPostProfileComponent implements OnInit {
    @Input() post: IPetPost;
    @Input() user: IUser;

    @Output() closePostEvent = new EventEmitter<void>();
    @Output() deletePostEvent = new EventEmitter<void>();

    postUser: IUser;
    postUserLoaded: Observable<boolean>;

    descriptionComment: IPetPostComment;

    postComments: IPetPostComment[] = [];
    postCommentsLoaded: Observable<boolean>;

    postLikes: IPetPostUserLike[] = [];
    postLikesLoaded: Observable<boolean>;

    showEllipsis: boolean = true;
    isLiked: boolean = false;
    isCommentInputFocused: boolean = false;
    isCommentAnAnswer: boolean = false;

    comment: string = "";
    answerCommentId: number = null;
    commentsLength: number = 0;

    @ViewChild("commentField") commentField: ElementRef;
    @ViewChild("deletePostContent") deletePostContent: ElementRef;

    constructor(
        private dataService: DataService,
        private alertService: AlertService,
        private modalService: NgbModal,
        config: NgbCarouselConfig
    ) {
        config.interval = 0;
        config.keyboard = true;
        config.animation = false;
        config.wrap = false;
    }

    ngOnInit(): void {
        this.postUserLoaded = this.getPostUser();
        this.postCommentsLoaded = this.getPostComments();
        this.postLikesLoaded = this.getPostLikes();
        this.generateDescriptionComment();

        console.log(this.post);
    }

    getPostUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, this.post.user_id)
                .then((response: any) => {
                    if (response.success) {
                        this.postUser = response.result[0] as IUser;
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

    getPostComments(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(
                    DBTables.PetPostComment,
                    DBTables.PetPost,
                    this.post.id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.postComments =
                            response.result as IPetPostComment[];
                        this.commentsLength = this.postComments.length;
                        this.configureCommentAnswers();
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

    configureCommentAnswers() {
        for (let i = 0; i < this.postComments.length; i++) {
            const comment = this.postComments[i];
            comment.answers = [];
        }

        for (let i = this.postComments.length - 1; i >= 0; i--) {
            const comment = this.postComments[i];

            if (comment.is_answer) {
                for (let j = 0; j < this.postComments.length; j++) {
                    const otherComment = this.postComments[j];

                    if (comment.answer_comment_id === otherComment.id) {
                        otherComment.answers.unshift(comment);
                        this.postComments.splice(i, 1);
                    }
                }
            }
        }
    }

    getPostLikes(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(
                    DBTables.PetPostUserLike,
                    DBTables.PetPost,
                    this.post.id
                )
                .then((response: any) => {
                    if (response.success) {
                        this.postLikes = response.result as IPetPostUserLike[];
                        this.checkIfPostIsLiked();
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

    checkIfPostIsLiked() {
        for (let i = 0; i < this.postLikes.length; i++) {
            const post = this.postLikes[i];

            if (post.user_id === this.user.id) {
                this.isLiked = true;
                break;
            }
        }
    }

    generateDescriptionComment() {
        this.descriptionComment = {
            content: this.post.description,
            is_answer: false,
            post_id: this.post.id,
            user_id: this.post.user_id,
            created_at: this.post.created_at,
            updated_at: this.post.created_at,
        };
    }

    likePost() {
        const data: IPetPostUserLike = {
            post_id: this.post.id,
            user_id: this.user.id,
        };

        this.dataService
            .insert(DBTables.PetPostUserLike, data)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    data.id = response.result.insertId;
                    data.created_at = new Date(response.created_at);
                    data.updated_at = new Date(response.created_at);

                    this.postLikes.push(data);
                    this.isLiked = true;
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    dislikePost() {
        const post: IPetPostUserLike = this.postLikes.filter((p) => {
            return p.post_id === this.post.id && p.user_id === this.user.id;
        })[0];

        this.dataService
            .delete(DBTables.PetPostUserLike, post)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    this.postLikes.splice(this.postLikes.indexOf(post), 1);
                    this.isLiked = false;
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    postComment() {
        const data: IPetPostComment = {
            content: this.comment,
            is_answer: this.isCommentAnAnswer,
            answer_comment_id: this.answerCommentId,
            post_id: this.post.id,
            user_id: this.user.id,
        };

        this.dataService
            .insert(DBTables.PetPostComment, data)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    data.id = response.result.insertId;
                    data.created_at = new Date(response.created_at);
                    data.updated_at = new Date(response.created_at);

                    if (data.is_answer) {
                        for (let i = 0; i < this.postComments.length; i++) {
                            const comment = this.postComments[i];

                            if (comment.id === data.answer_comment_id) {
                                comment.answers.unshift(data);
                                break;
                            }
                        }
                    } else {
                        this.postComments.unshift(data);
                    }

                    this.commentsLength++;
                    this.isCommentAnAnswer = false;
                    this.answerCommentId = null;
                    this.comment = "";
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    setCommentAsAnswer(commentId: number) {
        this.isCommentAnAnswer = true;
        this.answerCommentId = commentId;
        this.focusComment();
    }

    focusComment() {
        var commentTextAreaNativeElement: HTMLTextAreaElement =
            this.commentField.nativeElement;
        commentTextAreaNativeElement.focus();
    }

    closePost() {
        this.closePostEvent.emit();
    }

    editPost() {}

    enableComments() {
        this.post.enable_comments = true;

        this.dataService
            .update(DBTables.PetPost, this.post)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    this.alertService.openInfo("COMMENTS_ENABLED");
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    disableComments() {
        this.post.enable_comments = false;

        this.dataService
            .update(DBTables.PetPost, this.post)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    this.alertService.openInfo("COMMENTS_DISABLED");
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async share() {
        const base64Response = await fetch(this.post.image);
        const blob = await base64Response.blob();

        const data: ShareData = {
            url: location.href,
            text: "World!",
            title: "Hello",
            files: [new File([blob], this.user.name)],
        };
        if (navigator.canShare(data)) {
            navigator.share(data);
        }
    }

    copyLink() {
        navigator.clipboard.writeText("Test");
        this.alertService.openInfo("LINK_COPIED_TO_CLIPBOARD");
    }

    delete() {
        this.modalService.open(this.deletePostContent, {
            centered: true
        })
    }

    handleDeletePost(closeEvent: any) {
        this.dataService
            .delete(DBTables.PetPost, this.post)
            .then((response: any) => {
                if (response.success) {
                    this.deletePostEvent.emit();
                    closeEvent("Post deleted");
                    this.alertService.openInfo("POST_DELETED");
                    this.closePost();
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }
}
