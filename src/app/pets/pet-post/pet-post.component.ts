import { Component, Input, OnInit } from "@angular/core";
import { DataService, SessionService } from "src/app/services";
import { DBTables, User } from "src/classes";
import { RoleEnum } from "src/app/enums/enums";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IPetPost } from "src/app/interfaces";

@Component({
    selector: "app-pet-post",
    templateUrl: "./pet-post.component.html",
    styleUrls: ["./pet-post.component.css"],
})
export class PetPostComponent implements OnInit {
    @Input() post: IPetPost;
    @Input() user: User;
    @Input() isLast: boolean;

    postUser: User;
    postUserLoaded: Observable<boolean>;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.postUserLoaded = this.getPostUser();
    }

    getPostUser(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.User, this.post.user_id)
                .then((response: any) => {
                    if (response.success) {
                        this.postUser = response.result[0] as User;
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
}
