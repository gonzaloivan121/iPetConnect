import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService, SessionService } from "src/app/services";
import { DBTables, User } from "src/classes";
import { IBlogPostResponse, IBlogPost, IBlogComment, IBlogTag } from "src/app/interfaces";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-blog-post",
    templateUrl: "./blog-post.component.html",
    styleUrls: ["./blog-post.component.css"],
})
export class BlogPostComponent implements OnInit, OnDestroy {
    routeSubscription: Subscription;
    post: IBlogPost;
    user?: User;
    postUser: User;
    postComments: IBlogComment[];
    postTags: IBlogTag[];

    public postLoaded: Observable<boolean>;
    public postUserLoaded: Observable<boolean>;
    public postCommentsLoaded: Observable<boolean>;
    public postTagsLoaded: Observable<boolean>;

    public commentForm: UntypedFormGroup;
    public isCommentFocused: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private sessionService: SessionService,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        if (this.sessionService.get("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
        }

        this.routeSubscription = this.route.params.subscribe(
            (params: { id: number }) => {
                const id = params.id;
                this.postLoaded = this.loadPost(id);
            }
        );

        this.commentForm = this.formBuilder.group({
            comment: ["", [Validators.required]],
        });
    }

    get comment() {
        return this.commentForm.get("comment");
    }

    onSubmit() {
        const formData = this.commentForm.value;
        const data: IBlogComment = {
            content: formData.comment,
            post_id: this.post.id,
            user_id: this.user.id,
            likes: 0,
        };

        this.insertComment(data);
    }

    insertComment(data: IBlogComment) {
        this.dataService
            .insert(DBTables.BlogComment, data)
            .then((response: any) => {
                if (response.success) {
                    const comment = data;
                    comment.id = response.result.insertId;
                    comment.created_at = response.created_at;
                    comment.updated_at = response.updated_at;

                    this.postComments.push(comment);

                    this.comment.setValue(null);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    loadPost(id: number): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.BlogPost, id)
                .then((response: IBlogPostResponse) => {
                    if (response.success) {
                        if (response.result.length > 0) {
                            this.post = response.result[0] as IBlogPost;
                            this.postUserLoaded = this.loadPostUser(
                                this.post.user_id
                            );
                            this.postCommentsLoaded = this.loadPostComments(
                                this.post.id
                            );
                            this.postTagsLoaded = this.loadPostTags(
                                this.post.id
                            );
                        } else {
                            console.warn("Empty data!");
                        }
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

    loadPostUser(id: number): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, id)
                .then((response: any) => {
                    if (response.success) {
                        this.postUser = response.result[0] as User;
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

    loadPostComments(id: number): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.BlogComment, DBTables.BlogPost, id)
                .then((response: any) => {
                    if (response.success) {
                        this.postComments = response.result as IBlogComment[];
                        console.log(this.postComments);
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

    loadPostTags(id: number): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.BlogTag, DBTables.BlogPost, id)
                .then((response: any) => {
                    if (response.success) {
                        this.postTags = response.result as IBlogTag[];
                        console.log(this.postTags);
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

    likeComment(comment: IBlogComment) {
        if (this.user === undefined) return;
        
        comment.likes++;
        this.dataService
            .update(DBTables.BlogComment, comment)
            .then((response: any) => {
                console.log(response);

                if (response.success) {
                } else {
                }
            })
            .catch((error) => console.error(error));
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }
}
