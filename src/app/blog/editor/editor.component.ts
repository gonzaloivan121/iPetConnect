import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Editor, Toolbar } from "ngx-editor";
import { schema } from "ngx-editor/schema";
import { Page, RoleEnum } from "src/app/enums/enums";
import { IBlogCategory, IBlogPost, IBlogPostRequest, IBlogPostInsertResponse, IBlogTag, IUser, IBlogPostResponse } from "src/app/interfaces";
import { SessionService, DataService, AlertService, NavigationService } from "src/app/services";
import { DBTables } from "src/classes";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"],
})
export class EditorComponent implements OnInit, OnDestroy {
    category: IBlogCategory = null;
    tags: IBlogTag[] = [];
    title: string = "";
    description: string = "";
    content: string = "";
    image: string = "";

    user: IUser;
    previewPost: IBlogPost;

    isValidForPublishing: boolean = false;
    isValidForPreview: boolean = false;
    isValidForSaving: boolean = false;

    editor: Editor;

    toolbar: Toolbar = [
        ["bold", "italic"],
        ["underline", "strike"],
        ["code", "blockquote"],
        ["ordered_list", "bullet_list"],
        [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
        ["link", "image"],
        ["text_color", "background_color"],
        ["align_left", "align_center", "align_right", "align_justify"],
        ["horizontal_rule", "format_clear"],
    ];

    public postLoaded: Observable<boolean>;
    routeSubscription: Subscription;
    post?: IBlogPost;

    constructor(
        private location: Location,
        private sessionService: SessionService,
        private dataService: DataService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private navigationService: NavigationService,
        private route: ActivatedRoute
    ) {
        this.navigationService.set(Page.BlogEditor);
    }

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
            if (this.user.role_id != RoleEnum.Blogger) {
                this.location.back();
            }
        } else {
            this.location.back();
        }

        this.editor = new Editor({
            content: "",
            history: true,
            keyboardShortcuts: true,
            inputRules: true,
            plugins: [], //https://prosemirror.net/docs/guide/#state
            schema, //https://prosemirror.net/examples/schema/
            nodeViews: {}, //https://prosemirror.net/docs/guide/#state,
            attributes: {}, // https://prosemirror.net/docs/ref/#view.EditorProps.attributes
            linkValidationPattern: "",
        });

        this.routeSubscription = this.route.params.subscribe(
            (params: { id: number }) => {
                const id = params.id;

                if (id) {
                    this.postLoaded = this.loadPost(id);
                }
            }
        );
    }

    loadPost(id: number): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.BlogPost, id)
                .then((response: IBlogPostResponse) => {
                    if (response.success) {
                        if (response.result.length > 0) {
                            this.post = response.result[0] as IBlogPost;

                            this.fillEditPostInfo();
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

    fillEditPostInfo() {
        this.content = this.post.content;

        this.changeTitle(this.post.title);
        this.changeDescription(this.post.description);
        this.changeImage(this.post.image);
        this.category.id = this.post.category_id;
    }

    ngOnDestroy(): void {
        this.editor.destroy();
        this.routeSubscription.unsubscribe();
    }

    save(publish: boolean = false) {
        const data: IBlogPostRequest = {
            title: this.title,
            description: this.description,
            content: this.content,
            image: this.image,
            category_id: this.category.id,
            user_id: this.user.id,
        };

        if (publish) {
            this.insertPost(data, (post: IBlogPost) => {
                post.published = true;
                this.dataService.update(DBTables.BlogPost, post);
            });
        } else {
            this.insertPost(data);
        }

    }

    publish() {
        this.save(true);
    }

    unpublish() {
        
    }

    insertPost(data: IBlogPostRequest, callback?: Function) {
        this.dataService
            .insert(DBTables.BlogPost, data)
            .then((response: IBlogPostInsertResponse) => {
                if (response.success) {
                    const postId = response.result.insertId;
                    this.insertTags(postId);

                    if (callback) {
                        callback({
                            id: postId
                        });
                    }
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }

    insertTags(postId: number) {
        const data = {
            post_id: postId,
            tag_ids: [],
        };

        this.tags.forEach((tag) => {
            data.tag_ids.push(tag.id);
        });

        this.dataService
            .insert(DBTables.BlogPostTag, data)
            .then((response: IBlogPostInsertResponse) => {
                if (response.success) {
                    this.alertService.openSuccess(
                        "Blog Post created successfully!"
                    );
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                this.alertService.openDanger("There has been an error!");
            });
    }

    selectCategory(category: IBlogCategory) {
        this.category = category;

        this.checkValidity();
    }

    addTag(tag: IBlogTag) {
        this.tags.push(tag);

        this.checkValidity();
    }

    removeTag(tag: IBlogTag) {
        this.tags.splice(this.tags.indexOf(tag), 1);

        this.checkValidity();
    }

    changeDescription(description: string) {
        this.description = description;

        this.checkValidity();
    }

    changeTitle(title: string) {
        this.title = title;

        this.checkValidity();
    }

    changeImage(image: string) {
        this.image = image;

        this.checkValidity();
    }

    checkValidity() {
        this.checkPublishingValidity();
        this.checkPreviewValidity();
        this.checkSavingValidity();
    }

    checkPublishingValidity() {
        this.isValidForPublishing =
            this.title !== "" &&
            this.description !== "" &&
            this.category !== null &&
            this.tags.length > 0 &&
            this.content !== "" &&
            this.image !== "";
    }

    checkPreviewValidity() {
        this.isValidForPreview =
            this.category !== null && this.tags.length > 0 && this.image !== "";
    }

    checkSavingValidity() {
        this.isValidForSaving =
            this.title !== "" &&
            this.description !== "" &&
            this.category !== null &&
            this.tags.length > 0 &&
            this.content !== "" &&
            this.image !== "";
    }

    exit() {
        this.location.back();
    }

    preview(content) {
        this.previewPost = {
            id: 0,
            title: this.title,
            description: this.description,
            content: this.content,
            image: this.image,
            popularity: 0,
            published: false,
            category_id: this.category.id,
            user_id: this.user.id,
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.modalService.open(content, { fullscreen: true });
    }
}
