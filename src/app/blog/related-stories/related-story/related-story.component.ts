import { Component, Input, OnInit } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService } from "src/app/services";
import { IBlogPost } from "src/app/interfaces";
import { DBTables, User } from "src/classes";

@Component({
    selector: "app-related-story",
    templateUrl: "./related-story.component.html",
    styleUrls: ["./related-story.component.css"],
})
export class RelatedStoryComponent implements OnInit {
    @Input() post: IBlogPost;

    public userLoaded: Observable<boolean>;

    public user: User;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.userLoaded = this.loadUser();
    }

    loadUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, this.post.user_id)
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
}
