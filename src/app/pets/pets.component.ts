import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { DataService, NavigationService, SessionService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { Page, RoleEnum } from "src/app/enums/enums";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IPetPost, IUser, ISidebarSpecification } from "src/app/interfaces";

@Component({
    selector: "app-pets",
    templateUrl: "./pets.component.html",
    styleUrls: ["./pets.component.css"],
})
export class PetsComponent implements OnInit {
    user: IUser;
    petPosts: IPetPost[];

    public petPostsLoaded: Observable<boolean>;

    sidebarExpanded: boolean = true;
    sidebarSpecification: ISidebarSpecification = {
        links: [
            {
                text: "HOME",
                routeUrl: "",
                hasChildren: false,
                hasIcon: true,
                icon: "assets/img/svg/icon.svg",
            },
            {
                text: "CREATE",
                routeUrl: "",
                hasChildren: false,
                hasIcon: true,
                icon: "assets/img/svg/icon.svg",
            },
            {
                text: "PROFILE",
                routeUrl: "",
                hasChildren: false,
                hasIcon: true,
                icon: "assets/img/svg/icon.svg",
            },
        ],
    };

    constructor(
        private sessionService: SessionService,
        private dataService: DataService,
        private location: Location,
        private navigationService: NavigationService
    ) {
        this.navigationService.set(Page.Pets);
    }

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
            if (this.user.role_id == RoleEnum.Blogger) {
                this.location.back();
            }
        } else {
            this.location.back();
        }

        this.getData();
    }

    getData() {
        this.petPostsLoaded = this.getPetPosts();
    }

    getPetPosts(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.PetPost)
                .then((response: any) => {
                    if (response.success) {
                        this.petPosts = (
                            response.result as IPetPost[]
                        ).reverse();
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
