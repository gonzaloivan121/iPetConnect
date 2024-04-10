import { Component, Input, OnInit } from "@angular/core";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IPetPost, IUser } from "src/app/interfaces";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-pet-post",
    templateUrl: "./pet-post.component.html",
    styleUrls: ["./pet-post.component.css"],
})
export class PetPostComponent implements OnInit {
    @Input() post: IPetPost;
    @Input() user: IUser;
    @Input() isLast: boolean;
    @Input() isFromProfile: boolean = false;

    postUser: IUser;
    postUserLoaded: Observable<boolean>;

    showEllipsis: boolean = true;

    constructor(private dataService: DataService, config: NgbCarouselConfig) {
        config.interval = 0;
        config.keyboard = true;
        config.animation = false;
        config.wrap = false;
    }

    ngOnInit(): void {
        this.postUserLoaded = this.getPostUser();
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
}
