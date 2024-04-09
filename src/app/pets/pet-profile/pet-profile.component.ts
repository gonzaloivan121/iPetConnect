import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService, UsersService, SessionService, AlertService, NavigationService } from "src/app/services";
import { DBTables } from "src/classes";
import { IPetPost, IUser } from "src/app/interfaces";
import { Page } from "src/app/enums/enums";

@Component({
    selector: "app-pet-profile",
    templateUrl: "./pet-profile.component.html",
    styleUrls: ["./pet-profile.component.css"],
})
export class PetProfileComponent {
    routeSubscription: Subscription;
    user: IUser;
    profileUser: IUser;
    petPosts: IPetPost[];

    public profileUserLoaded: Observable<boolean>;
    public postsLoaded: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private usersService: UsersService,
        private sessionService: SessionService,
        private alertService: AlertService,
        private navigationService: NavigationService
    ) {
        this.navigationService.set(Page.PetsProfile);
    }

    ngOnInit(): void {
        if (this.sessionService.exists("user")) {
            this.user = JSON.parse(this.sessionService.get("user"));
        }

        this.routeSubscription = this.route.params.subscribe(
            (params: { username: string }) => {
                const username = params.username;
                this.profileUserLoaded = this.loadProfileUser(username);
            }
        );
    }

    loadProfileUser(username: string): Observable<boolean> {
        return from(
            this.usersService
                .getByUsername(username)
                .then((response: any) => {
                    if (response.success) {
                        this.profileUser = response.result[0] as IUser;
                        this.postsLoaded = this.loadPetsFromUser(
                            this.profileUser.id
                        );
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

    loadPetsFromUser(id: number): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.PetPost, DBTables.User, id)
                .then((response: any) => {
                    if (response.success) {
                        this.petPosts = response.result as IPetPost[];
                        console.log(this.petPosts);
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

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }
}
