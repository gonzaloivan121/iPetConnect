import { Component, Input, OnInit } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { IBlogPost } from "src/app/interfaces";

@Component({
    selector: "app-related-stories",
    templateUrl: "./related-stories.component.html",
    styleUrls: ["./related-stories.component.css"],
})
export class RelatedStoriesComponent implements OnInit {
    @Input() categoryId: number;
    @Input() postId: number;

    public postsLoaded: Observable<boolean>;

    public posts: IBlogPost[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.postsLoaded = this.loadRelatedPosts();
    }

    loadRelatedPosts(): Observable<boolean> {
        return from(
            this.dataService
                .getFromExcluding(
                    DBTables.BlogPost,
                    DBTables.BlogCategory,
                    this.categoryId,
                    this.postId
                )
                .then((response: any) => {
                    if (response.success) {
                        this.posts = response.result as IBlogPost[];
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
}
