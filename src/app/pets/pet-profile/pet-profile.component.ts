import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DataService, UsersService, SessionService, AlertService, NavigationService } from "src/app/services";
import { DBTables } from "src/classes";
import { IPet, IPetPost, IUser } from "src/app/interfaces";
import { Page, PetProfileTabEnum } from "src/app/enums/enums";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
    pets: IPet[];

    public profileUserLoaded: Observable<boolean>;
    public postsLoaded: Observable<boolean>;
    public petsLoaded: Observable<boolean>;
    public followedByLoaded: Observable<boolean>;
    
    public activeTab: PetProfileTabEnum = PetProfileTabEnum.Posts;
    
    public get petProfileTabEnum(): typeof PetProfileTabEnum {
        return PetProfileTabEnum;
    }
    
    isFollowing: boolean = false;
    isUserFound: boolean = true;
    
    followers: number = 0;
    following: number = 0;

    followedBy: string[];

    selectedPost: IPetPost;

    @ViewChild("postContent", { static: false })
    postContent: ElementRef;

    @ViewChild("followingContent", { static: false })
    followingContent: ElementRef;

    @ViewChild("followersContent", { static: false })
    followersContent: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        private usersService: UsersService,
        private sessionService: SessionService,
        private alertService: AlertService,
        private navigationService: NavigationService,
        private modalService: NgbModal
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

    setIsUserFoundToFalse(): Observable<boolean> {
        return from(
            Promise.resolve(false)
                .then((value) => {
                    console.log(value);
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => false),
            catchError(() => of(false))
        );
    }

    loadProfileUser(username: string): Observable<boolean> {
        return from(
            this.usersService
                .getByUsername(username)
                .then((response: any) => {
                    if (response.success) {
                        var user = response.result[0] as IUser;

                        if (!user) {
                            this.isUserFound = false;
                            return;
                        }

                        this.profileUser = response.result[0] as IUser;
                        this.postsLoaded = this.loadPostsFromUser(
                            this.profileUser.id
                        );
                        this.petsLoaded = this.loadPetsFromUser(
                            this.profileUser.id
                        );

                        this.checkIfIsFollowing();
                        this.getFollowers();
                        this.getFollowing();
                        this.followedByLoaded = this.getFollowedBy();
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

    loadPostsFromUser(userId: number): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.PetPost, DBTables.User, userId)
                .then((response: any) => {
                    if (response.success) {
                        this.petPosts = (
                            response.result as IPetPost[]
                        ).reverse();
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

    loadPetsFromUser(userId: number): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.Pet, DBTables.User, userId)
                .then((response: any) => {
                    if (response.success) {
                        this.pets = (response.result as IPet[]).reverse();
                        console.log(this.pets);
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

    checkIfIsFollowing(): void {
        this.usersService
            .isFollowing(this.user.id, this.profileUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.isFollowing = response.result.length > 0;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    follow(userId: number) {
        this.usersService
            .follow(this.user.id, userId)
            .then((response: any) => {
                if (response.success) {
                    this.isFollowing = true;
                    this.followers++;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    unfollow(userId: number) {
        this.usersService
            .unfollow(this.user.id, userId)
            .then((response: any) => {
                if (response.success) {
                    this.isFollowing = false;
                    this.followers--;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getFollowers() {
        this.usersService
            .getFollowers(this.profileUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.followers = response.result.length;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getFollowing() {
        this.usersService
            .getFollowing(this.profileUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.following = response.result.length;
                    console.log(response.result);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getFollowedBy() {
        return from(
            this.usersService
                .getFollowedBy(this.profileUser.id, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.followedBy = response.result;
                        console.log(this.followedBy);
                    } else {
                        console.error(response.message);
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

    openPost(post: IPetPost) {
        this.selectedPost = post;
        this.modalService.open(this.postContent, {
            centered: true,
            size: "xxl",
        });
    }

    openPet(pet: IPet) {
        console.log(pet);
    }

    openFollowing() {
        this.modalService.open(this.followingContent, {
            centered: true,
        });
    }

    openFollowers() {
        this.modalService.open(this.followersContent, {
            centered: true,
        });
    }

    changeTab(tab: PetProfileTabEnum): void {
        this.activeTab = tab;
    }
}