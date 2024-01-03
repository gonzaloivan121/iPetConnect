import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { DataService } from "src/app/services";
import { BlogPost, DBTables } from "src/classes";
import { IBlogPostResponse } from "src/app/interfaces"

@Component({
    selector: "app-blog-post",
    templateUrl: "./blog-post.component.html",
    styleUrls: ["./blog-post.component.css"],
})
export class BlogPostComponent implements OnInit, OnDestroy {

    routeSubscription: Subscription;
    post: BlogPost;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dataService: DataService
    ) {
        this.activatedRoute.params.subscribe((params) => console.log(params));
    }

    ngOnInit(): void {
        this.routeSubscription = this.activatedRoute.params.subscribe(
            (params) => {
                const id = params["id"];
                this.dataService.get(DBTables.BlogPost, id).then((response: IBlogPostResponse) => {
                    if (response.success) {
                        if (response.result.length > 0) {
                            this.post = response.result[0] as BlogPost;
                        } else {
                            console.warn("Empty data!")
                        }
                    } else {
                        console.error(response.message);
                    }
                }).catch((error) => console.error(error));
            }
        );
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }
}
