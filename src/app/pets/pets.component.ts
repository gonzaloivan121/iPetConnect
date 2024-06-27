import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { DataService, NavigationService, SessionService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { Page, RoleEnum } from "src/app/enums/enums";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IPetPost, IUser, ISidebarSpecification } from "src/app/interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
    sidebarSpecification: ISidebarSpecification;

    @ViewChild("createPostContent", { static: false })
    createPostContent: ElementRef;

    @ViewChild("createPetContent", { static: false })
    createPetContent: ElementRef;

    @ViewChild("searchContent", { static: false })
    searchContent: ElementRef;

    constructor(
        private sessionService: SessionService,
        private dataService: DataService,
        private location: Location,
        private navigationService: NavigationService,
        private modalService: NgbModal
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
        this.setupSidebar();
    }

    getData() {
        this.petPostsLoaded = this.getPetPosts();
    }

    setupSidebar() {
        this.sidebarSpecification = {
            links: [
                {
                    text: "HOME",
                    routerUrl: "/pets",
                    hasRouterLink: true,
                    hasChildren: false,
                    hasIcon: true,
                    hasCallback: true,
                    isActive: true,
                    icon: "world",
                    callback: () => {
                        console.log("HOME");
                    },
                },
                {
                    text: "SEARCH",
                    hasRouterLink: false,
                    hasChildren: false,
                    hasIcon: true,
                    hasCallback: true,
                    isActive: false,
                    icon: "zoom-split-in",
                    callback: () => {
                        console.log("SEARCH");
                        this.openSearch();
                    },
                },
                {
                    text: "PET_POST",
                    hasRouterLink: false,
                    hasChildren: false,
                    hasIcon: true,
                    hasCallback: true,
                    isActive: false,
                    icon: "image",
                    callback: () => {
                        console.log("PET_POST");
                        this.openCreatePost();
                    },
                },
                {
                    text: "PET",
                    hasRouterLink: false,
                    hasChildren: false,
                    hasIcon: true,
                    hasCallback: true,
                    isActive: false,
                    icon: "album-2",
                    callback: () => {
                        console.log("PET");
                        this.openCreatePet();
                    },
                },
                {
                    text: "PROFILE",
                    hasRouterLink: true,
                    routerUrl: "/pets/" + this.user.username,
                    hasChildren: false,
                    hasIcon: true,
                    hasCallback: true,
                    isActive: false,
                    icon: "circle-08",
                    callback: () => {
                        console.log("PROFILE");
                    },
                },
            ],
        };
    }

    getPetPosts(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.PetPost, DBTables.UserFollowing, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.petPosts = response.result as IPetPost[];
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

    openCreatePost() {
        this.modalService.open(this.createPostContent, {
            centered: true,
            size: "lg",
        });
    }

    openCreatePet() {
        this.modalService.open(this.createPetContent, {
            centered: true,
            size: "lg",
        });
    }

    openSearch() {
        this.modalService.open(this.searchContent, {
            centered: true,
            size: "md",
        });
    }
}
