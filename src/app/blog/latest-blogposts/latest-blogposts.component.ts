import { Component, OnInit } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { IBlogPost } from "src/app/interfaces";

@Component({
    selector: "app-latest-blogposts",
    templateUrl: "./latest-blogposts.component.html",
    styleUrls: ["./latest-blogposts.component.css"],
})
export class LatestBlogpostsComponent implements OnInit {
    posts: IBlogPost[] = [];

    public postsLoaded: Observable<boolean>;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.postsLoaded = this.loadPosts();
    }

    loadPosts(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.BlogPost + "/latest")
                .then((response: any) => {
                    if (response.success) {
                        this.posts = response.result as IBlogPost[];
                        console.log(this.posts)
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
